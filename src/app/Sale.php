<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Sale extends Model
{
    use SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];
    
    public function enterprise()
    {
        return $this->belongsTo('App\Enterprise');
    }
    
    public function contact()
    {
        return $this->hasOne('App\Contact');
    }   
    
    public function products()
    {
        return $this->belongsToMany('App\Product')->withPivot('quantity');
    }
    
    public function currency()
    {
        return $this->hasOne('App\Currency');
    }
    
    public function status()
    {
        return $this->belongsTo('App\SaleStatus');
    }    
    
    public function logs()
    {
        return $this->hasMany('App\SaleStatusLog');
    }
    
    public function attachments()
    {
        return $this->hasMany('App\Attachments');
    }
}
