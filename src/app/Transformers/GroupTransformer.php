<?php
namespace App\Transformers;

use App\Group;
use League\Fractal\TransformerAbstract;

class GroupTransformer extends TransformerAbstract
{

    /**
     * Transforms the Model object to a associative array
     * This decouples DB columns from API response structure
     * 
     * @param Model $model
     * @return array
     */
    public function transform(Group $model)
    {

        return [
            'id' => (int) $model->id,
            'name' => $model->name
        ];
    }
}
