<?php
namespace App\Transformers;

use App\Sale;
use League\Fractal\TransformerAbstract;

class SaleTransformer extends TransformerAbstract
{

    /**
     * Transforms the Model object to a associative array
     * This decouples DB columns from API response structure
     * 
     * @param Model $model
     * @return array
     */
    public function transform(Sale $model)
    {
        
        $date_format = config('app.date_format');
        
        return [
            'id'=> $model->id,
            'date'=> $model->created_at->format($date_format),
            'contact_mean'=> $model->contact_mean,
            'client_type'=> $model->enterprise->client_type,
            'enterprise'=> $model->enterprise,
            'contact'=> $model->contact,
            'quotation'=> $model->quotation,
            'observations'=> $model->observations,
            'status'=> $model->status
        ];
    }
}
