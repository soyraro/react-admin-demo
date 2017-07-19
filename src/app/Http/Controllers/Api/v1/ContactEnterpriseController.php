<?php

namespace App\Http\Controllers\Api\v1;

use App\Contact;
use App\Http\Controllers\Controller;
use App\Transformers\ContactListTransformer;
use App\Transformers\ContactTransformer;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Spatie\Fractal\FractalFacade;

class ContactEnterpriseController extends Controller
{
    
    /**
     * GET /enterprises/contacts
     * 
     * List
     *
     * @return Response
     */
    public function all(Request $request, ContactListTransformer $transformer)
    {
       
        try {
          
            $enterprise_id = (int) $request->input('enterprise_id');
            $sector_id = (int) $request->input('sector_id');
            $state_id = (int) $request->input('state_id');
            
            $data = Contact::with(['emails'])
                ->select(
                    'contacts.id', 
                    'contacts.fullname', 
                    'contacts.position', 
                    'contacts.phones', 
                    'contacts.cellphone', 
                    'contact_enterprise.enterprise_id', 
                    'contact_sector.sector_id', 
                    'contact_states.id as state_id',
                    'contact_states.keyname as state_key',
                    'contact_states.name as state_name'
                )
                ->join('contact_enterprise', 'contacts.id', '=', 'contact_enterprise.contact_id')
                ->join('contact_sector', 'contacts.id', '=', 'contact_sector.contact_id')
                ->join('contact_states', 'contact_enterprise.state_id', '=', 'contact_states.id')
                ->when($enterprise_id, function ($query) use ($enterprise_id) {
                    $query->where('contact_enterprise.enterprise_id', $enterprise_id);
                })
                ->when($sector_id, function ($query) use ($sector_id) {
                    $query->where('contact_sector.sector_id', $sector_id);
                })
                ->when($state_id, function ($query) use ($state_id) {
                    $query->where('contact_states.id', $state_id);
                })
                ->get();
                
            $response = fractal()
                ->collection($data)
                ->transformWith($transformer)
                ->toArray();
            
        } catch (Exception $exc) {
           
            return response()->json([ 'message' => 'There was an error retrieving the records' ], 500);
        }

        return $response;
    }
        
    /**
     * GET /enterprises/{enterprise_id}/contacts
     * 
     * List
     *
     * @return Response
     */
    public function index(Request $request, ContactListTransformer $transformer, $enterprise_id)
    {
       
        try {
            
            $data = Contact::with(['emails'])
                ->select(
                    'contacts.id', 
                    'contacts.fullname', 
                    'contacts.position', 
                    'contacts.phones', 
                    'contacts.cellphone', 
                    'contact_enterprise.enterprise_id',
                    'contact_sector.sector_id', 
                    'contact_states.id as state_id',
                    'contact_states.keyname as state_key',
                    'contact_states.name as state_name'
                )
                ->join('contact_enterprise', function($join) use($enterprise_id) {
                    $join->on('contacts.id', '=', 'contact_enterprise.contact_id')
                        ->where('contact_enterprise.enterprise_id', '=', $enterprise_id);
                    
                })
                ->join('contact_sector', 'contacts.id', '=', 'contact_sector.contact_id')
                ->join('contact_states', 'contact_enterprise.state_id', '=', 'contact_states.id')
                ->get();
               
            $response = fractal()
                ->collection($data)
                ->transformWith($transformer)
                ->toArray();
            
        } catch (Exception $exc) {
           
            return response()->json([ 'message' => 'There was an error retrieving the records' ], 500);
        }

        return $response;
    }
    
   /**
     * GET /enterprises/{enterprise_id}/contacts/{$contact_id}
     * 
     * @param integer $contact_id 
     * @return json
     */
    public function show(ContactTransformer $transformer, $enterprise_id, /*int*/ $contact_id)
    {

        try {

            $data = Contact::with(['emails', 'sectors', 'enterprises' => function($query) {
                $query->select('id', 'legal_name', 'state_id');
            }])
                ->select(
                    'contacts.id', 
                    'contacts.fullname', 
                    'contacts.position', 
                    'contacts.phones', 
                    'contacts.cellphone'
                )
                ->where('contacts.id', $contact_id)
                ->whereHas('enterprises', function ($query) use ($enterprise_id) {
                    $query->where('id', $enterprise_id);
                })
                ->first();
            
            // decouple DB columns from API response fields
            $response = FractalFacade::item($data, $transformer)->toArray();
                
        } catch (ModelNotFoundException $ex) {
            return response()->json(['error' => 'Contact not found.'], 404);
        }

        return response()->json($response['data']);
    }
    
    /**
     * POST /enterprises/{enterprise_id}/contacts
     */
    public function store(Request $request, /*int*/ $enterprise_id)
    {
        $this->validate($request, [
                'fullname' => 'required|max:45',
                'position' => 'required|max:70',
                'sector' => 'required|integer',
                'cellphone' => 'sometimes|max:30',
                'contact_state' => 'required|integer',
                'emails.0.email' => 'sometimes|email',
                'emails.1.email' => 'sometimes|email',
                'emails.2.email' => 'sometimes|email'
            ]);
        
        $contact = new Contact;
        
        $contact->fullname = filter_var($request->input('fullname'), FILTER_SANITIZE_STRING);
        $contact->position = filter_var($request->input('position'), FILTER_SANITIZE_STRING);
        $contact->phones = filter_var($request->input('phones'), FILTER_SANITIZE_STRING);
        $contact->cellphone = filter_var($request->input('cellphone'), FILTER_SANITIZE_STRING);
        $contact->save();
        
        // relationships
        $state_id = intval($request->input('contact_state'));
        $sector_id = intval($request->input('sector'));
        $contact->enterprises()->attach($enterprise_id, ['state_id' => $state_id]);
        $contact->sectors()->attach($sector_id);
            
        foreach($request->input('emails') as $email) {
            DB::table('emails')
                ->insert(['email' => $email['email'], 'contact_id'=> $contact->id]);
        }
        
        return response()->json([
            'contact_id' => $contact->id,
            'created_at' => $contact->created_at
        ], 201);
    }
    
    /**
     * PUT|PATCH /enterprises/{$enterprise_id}/contacts/{$contact_id}
     */
    public function update(Request $request, /*int*/ $enterprise_id, $contact_id)
    {
        try {  
            
            if(count($request->all()) === 0) {
                abort(400, 'At least one field must contain data');
            }
            
            $this->validate($request, [
                'fullname' => 'sometimes|required|max:45',
                'position' => 'sometimes|required|max:70',
                'sector' => 'sometimes|required|integer',
                'phones' => 'sometimes',
                'cellphone' => 'sometimes|max:30',
                'contact_state' => 'sometimes|required|integer',
                'emails.0.email' => 'sometimes|email',
                'emails.1.email' => 'sometimes|email',
                'emails.2.email' => 'sometimes|email',
            ]);

            $contact = Contact::whereHas('enterprises', function ($query) use ($enterprise_id) {
                    $query->where('id', $enterprise_id);
                })->findOrFail($contact_id);
                
            $contact->fullname = filter_var($request->input('fullname'), FILTER_SANITIZE_STRING);
            $contact->position = filter_var($request->input('position'), FILTER_SANITIZE_STRING);
            $contact->phones = filter_var($request->input('phones'), FILTER_SANITIZE_STRING);
            $contact->cellphone = filter_var($request->input('cellphone'), FILTER_SANITIZE_STRING);
            $contact->save();
            
            // relationships
            $state_id = intval($request->input('contact_state'));
            $sector_id = intval($request->input('sector'));
            $contact->enterprises()->updateExistingPivot($enterprise_id, ['state_id' => $state_id]);
            $contact->sectors()->sync($sector_id);
            
            foreach($request->input('emails') as $email) {
                if(!empty($email['id'])) {
                    // update existing
                    DB::table('emails')
                        ->where('id', $email['id'])
                        ->where('contact_id', $contact->id)
                        ->update(['email' => $email['email']]);
                } else {
                    // create new
                    DB::table('emails')
                        ->insert(['email' => $email['email'], 'contact_id'=> $contact->id]);
                }
            }
            
        } catch (ModelNotFoundException $ex) {
            return response()->json(['error' => 'Record not found. Update error.'], 404);
        }
         
        return response()->make('', 204);
    }
    
    /**
     * PUT|PATCH /enterprises/{$enterprise_id}/contacts/{$contact_id}/state
     */
    public function updateState(Request $request, /*int*/ $enterprise_id, $contact_id)
    {
        try {  
            
            $this->validate($request, [
                'state.id' => 'required|integer'
            ]);
            
            $enterprise_id = intval($enterprise_id);

            $contact = Contact::whereHas('enterprises', function ($query) use ($enterprise_id) {
                    $query->where('id', $enterprise_id);
                })->findOrFail($contact_id);
            
            $state_id = intval($request->input('state.id'));
            $contact->enterprises()->updateExistingPivot($enterprise_id, ['state_id'=>$state_id]);
            
        } catch (ModelNotFoundException $ex) {
            return response()->json(['error' => 'Record not found. Update error.'], 404);
        }
         
        return response()->make('', 204);
    }
}
