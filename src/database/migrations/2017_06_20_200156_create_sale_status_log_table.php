<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSaleStatusLogTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sale_status_log', function (Blueprint $table) {
                        
            $table->integer('sale_status_id')->unsigned()->nullable()->index();
            $table->foreign('sale_status_id')->references('id')
                ->on('sale_status')->onDelete('restrict');

            $table->integer('sale_id')->unsigned()->nullable()->index();
            $table->foreign('sale_id')->references('id')
                ->on('sales')->onDelete('cascade');
            
            $table->primary(['sale_id', 'sale_status_id']);
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sale_status_log');
    }
}
