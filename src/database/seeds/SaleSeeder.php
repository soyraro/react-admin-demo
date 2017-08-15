<?php

use App\Sale;
use App\SaleStatuses;
use App\Quotation;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class SaleSeeder extends Seeder
{
    public function run()
    {
        
        DB::table('product_quotation')->delete();
        DB::table('quotations')->delete();
        DB::table('sales')->delete();
        DB::table('sale_statuses')->delete();
        DB::table('sale_status_logs')->delete();
        
        try {
            
            $faker = Faker::create();
         
            // create sales statuses
            $this->createSaleStatuses();
            
            // create transport type
            $this->createShipmentTypes();
            
            // create some sales
            $sales = factory(Sale::class, 21)->create();
            $sales->each(function($sale) use ($faker) {

                $quotation = factory(Quotation::class)->create([
                    'sale_id' => $sale->id
                ]); // create quotation
                
                $products = \App\Product::orderBy(DB::raw('RAND()'))->take(rand(1, 5))->get();

                $products->each(function($product) use ($faker, $quotation) {

                    $quotation->products()->attach($product, [
                        'quantity'=> rand(1, 7),
                        'currency_id'=> App\Currency::all()->random()->id,
                        'export_expenditure'=> $faker->randomFloat(2, 200, 9000),
                        'fob_price'=> $faker->randomFloat(2, 200, 9000),
                        'sale_price'=> $faker->randomFloat(2, 200, 9000)
                    ]);
                    
                    // transport
                    $shipment = \App\Shipment::orderBy(DB::raw('RAND()'))->take(1)->first();
                    if(!$shipment || rand(0, 10) > 7) {
                        // create a new transport record
                        $shipment = factory(App\Shipment::class)->create();
                    }
             
                    $product_quotation = \App\ProductQuotation::where("product_id", $product->id)->firstOrFail();
                    $product_quotation->shipments()->attach($shipment);
                });                             
            });

        } catch (\Illuminate\Database\QueryException $ex) {
            $error_code = $ex->errorInfo[1];
            if($error_code == 1062){
                print ('Skipping duplicated entry');
            }
            print ($ex->getMessage());
        }
    }
    
    private function createSaleStatuses() {
        
        $states = [
            1=>'Solicitud de Cotización', 
            2=>'Envío de pedido de precio a Proveedor', 
            3=>'A cotizar', 
            4=>'Cotizado',
            5=>'Envío de cotización',
            6=>'Recepción de OC'
        ];
        
        foreach ($states as $key => $state) {
        
            SaleStatuses::create(array(
                'code' => $key,
                'name' => $state
            ));
        }  
    }    
    
    private function createShipmentTypes() {
        
        $type = ['Avión', 'EMS', 'FOB', 'Marítimo Consolidado', 'Marítimo en Contenedor', 'Terrestre'];
        
        foreach ($type as $key => $state) {
        
            \App\ShipmentType::create(array(
                'name' => $state
            ));
        }  
    }   
}
