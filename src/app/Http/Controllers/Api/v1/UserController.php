<?php
namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Transformers\UserTransformer;
use App\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Spatie\Fractal\FractalFacade;

class UserController extends Controller
{

    /**
     * GET /users
     * 
     * Retrieves list of users
     * 
     * @param integer $user_id 
     * @return json
     */
    public function index(UserTransformer $transformer)
    {
       
        try {

            $data = User::all();
            
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
     * GET /users/me
     * 
     * Retrieves requested user
     * 
     * @param UserTransformer $transformer 
     * @param integer $user_id 
     * @return json
     */
    public function me(UserTransformer $transformer)
    {

        try {

            $user = auth('api')->user();
            
            // decouple DB columns from API response fields
            $response = FractalFacade::item($user, $transformer)->toArray();
        } catch (ModelNotFoundException $ex) {
            return response()->json(['error' => 'User not found.'], 404);
        }

        return response()->json($response);
    }
    
    /**
     * GET /users/{$user_id}
     * 
     * Retrieves requested user
     * 
     * @param UserTransformer $transformer 
     * @param integer $user_id 
     * @return json
     */
    public function show(UserTransformer $transformer, /*int*/ $user_id)
    {

        try {

            $user = User::findOrFail($user_id);

            // decouple DB columns from API response fields
            $response = FractalFacade::item($user, $transformer)->toArray();
        } catch (ModelNotFoundException $ex) {
            return response()->json(['error' => 'User not found.'], 404);
        }

        return response()->json($response);
    }

    /**
     * POST /users
     * 
     * @param Request $request
     * @return json
     */
    public function store(Request $request)
    {

        $this->validate($request, [
            'fullname' => 'required|max:30',
            'username' => 'required|max:20',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed'
        ]);

        $user = new User;
        $user->fullname = strip_tags($request->input('fullname'));
        $user->username = strip_tags($request->input('username'));
        $user->email = strip_tags($request->input('email'));
        $user->password = Hash::make($request->input('password'));
        $user->image = config('app.default_avatar'); // we set default image at this instance
        $user->save();

        return response()->json([
                'user_id' => $user->id,
                'created_at' => $user->created_at
                ], 201);
    }
    
    /**
     * PUT|PATCH /users/{$user_id}
     * 
     * @param Request $request
     * @param int $user_id
     * @return json
     */
    public function update(Request $request, /*int*/ $user_id)
    {

        try {

            if (count($request->all()) === 0) {
                abort(400, 'Al least one field must contain data');
            }

            $this->validate($request, [
                'fullname' => 'sometimes|required|max:255',
                'username' => 'sometimes|required|max:255',
                'email' => 'sometimes|required|email',
                'password' => 'sometimes|required|min:8|confirmed'
            ]);

            // retrieve record
            $user = User::findOrFail($user_id);

            // sanitize name
            $input['fullname'] = filter_var($request->input('fullname'), FILTER_SANITIZE_STRING);
            $input['username'] = filter_var($request->input('username'), FILTER_SANITIZE_STRING);
            $input['email'] = filter_var($request->input('email'), FILTER_SANITIZE_STRING);
            $input['password'] = Hash::make($request->input('password'));
            $request->replace($input);

            // fill method assures only expected fields will be stored
            $user->fill($request->all());
            $user->save();
        } catch (ModelNotFoundException $ex) {
            return response()->json(['error' => 'User not found.'], 404);
        }

        return response()->make('', 204);
    }

    /**
     * DELETE /users/{$user_id}
     * 
     * @param int $user_id
     * @return json
     */
    public function destroy(/*int*/ $user_id)
    {

        try {

            $user = User::findOrFail($user_id);
            $user->delete();
        } catch (ModelNotFoundException $ex) {
            return response()->json(['error' => 'User not found.'], 404);
        }

        return response()->make('', 204);
    }
}
