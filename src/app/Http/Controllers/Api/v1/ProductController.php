<?php

namespace App\Http\Controllers\Api\v1;

use App\Product;
use App\Http\Controllers\Controller;
use App\Transformers\ProductTransformer;
use Spatie\Fractal\FractalFacade;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ProductController extends Controller
{
    /**
     * GET /products
     * 
     * List
     *
     * @return Response
     */
    public function index(ProductTransformer $transformer)
    {
       
        try {

            $data = Product::with(['family', 'group', 'currency', 'provider'])
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
     * GET /products/{$id}
     * 
     * Retrieves requested item
     * 
     * @param ProductTransformer $transformer 
     * @param integer $id 
     * @return json
     */
    public function show(ProductTransformer $transformer, /*int*/ $id)
    {

        try {

            $modal = Product::findOrFail($id);

            // decouple DB columns from API response fields
            $response = FractalFacade::item($modal, $transformer)->toArray();
        } catch (ModelNotFoundException $ex) {
            return response()->json(['error' => 'Entity not found.'], 404);
        }

        return response()->json($response);
    }

}
