const config = {
    defaults: {
        country: 1 //'Argentina'
    },
    tables: {
        sizePerPage: 10,
        onDeleteSwal: {
            title: 'Confirma?',
            text: "Se eliminará el item",
            type: 'warning',            
            showCancelButton: true, 
            cancelButtonColor: '#ed6b75',
            cancelButtonText: 'No',   
            confirmButtonText: 'Si',
            confirmButtonColor: '#659be0',
        }
    }
}
export default config