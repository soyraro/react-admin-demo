<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];
    
    function currency()
    {
        return $this->belongsTo('App\Currency');
    }
    
    function family()
    {
        return $this->belongsTo('App\Family');
    }
    
    function group()
    {
        return $this->belongsTo('App\Group');
    }
    
    function provider()
    {
        return $this->belongsTo('App\Provider');
    }
    
    function sales()
    {
        return $this->belongsToMany('App\Sale')->withPivot('quantity');
    }
}
