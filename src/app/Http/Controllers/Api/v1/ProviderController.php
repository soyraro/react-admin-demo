<?php

namespace App\Http\Controllers\Api\v1;

use App\Provider;
use App\Http\Controllers\Controller;
use App\Transformers\ProviderTransformer;
use Illuminate\Http\Request;
use Spatie\Fractal\FractalFacade;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ProviderController extends Controller
{
    /**
     * GET /providers
     * 
     * List
     *
     * @return Response
     */
    public function index(Request $request, ProviderTransformer $transformer)
    {
       
        try {
            
            $country_id = (int) $request->input('country_id');

            $data = Provider::with(['country', 'province'])
                ->when($country_id, function ($query) use ($country_id) {
                    return $query->where('country_id', $country_id);
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
     * GET /providers/{$id}
     * 
     * Retrieves requested item
     * 
     * @param ProviderTransformer $transformer 
     * @param integer $id 
     * @return json
     */
    public function show(ProviderTransformer $transformer, /*int*/ $id)
    {

        try {

            $model = Provider::findOrFail($id);

            // decouple DB columns from API response fields
            $response = FractalFacade::item($model, $transformer)->toArray();
        } catch (ModelNotFoundException $ex) {
            return response()->json(['error' => 'Entity not found.'], 404);
        }

        return response()->json($response);
    }

}
