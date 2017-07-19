<?php
namespace App\Transformers;

use App\Interaction;
use League\Fractal\TransformerAbstract;

class InteractionTransformer extends TransformerAbstract
{

    /**
     * Transforms the Model object to a associative array
     * This decouples DB columns from API response structure
     * 
     * @param Model $model
     * @return array
     */
    public function transform(Interaction $model)
    {

        return [
            'id' => (int) $model->id,
            'description' => $model->description,
            'contact' => $model->contact,
            'date' => $model->created_at->format('d-m-Y'),
            'updated_at' => $model->updated_at->format('d-m-Y'),
        ];
    }
}
