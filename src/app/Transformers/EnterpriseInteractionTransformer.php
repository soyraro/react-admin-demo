<?php
namespace App\Transformers;

use App\Interaction;
use League\Fractal\TransformerAbstract;

class EnterpriseInteractionTransformer extends TransformerAbstract
{

    protected $enterprise_id = null;
    
    public function setEnterpriseId($enterprise_id) {
        $this->enterprise_id = (int) $enterprise_id;
    }
    
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
            'enterprise_id' => $this->enterprise_id,
            'date' => $model->created_at->format('d-m-Y'),
            'updated_at' => $model->updated_at->format('d-m-Y'),
        ];
    }
}
