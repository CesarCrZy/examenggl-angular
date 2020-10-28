import { ArticulosService } from './services/articulos.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  title = 'Examen';
  articuloNuevo: FormGroup;
  articuloEditar: FormGroup;
  ordenNueva: FormGroup;
  recepcionForm: FormGroup;
  salidaForm: FormGroup;
  public articulos: Array<any>=[];
  public proveedores: Array<any>=[];
  public recepciones: Array<any>=[];
  public salidas: Array<any>=[];
  public almacenes: Array<any>=[];
  public topemin: any;
  public topemax: any;
  public inventario: any;
  mostrar = false;
  mostrarinf = false;
  mostrarinf1 = false;
  oculto = true;
  public proveedor: any;

  constructor( 
    private articulosService:ArticulosService,
    private fo: FormBuilder
    )
    { 
      this.articulosService.getArticulos().subscribe((resp: any) => {
        this.articulos = resp;
        //console.log(resp)
      });

      this.articuloNuevo = this.fo.group({
        id: [0],
        nombre: ['', Validators.required],
        precio: ['', Validators.required],
        topemin: ['', Validators.required],
        topemax: ['', Validators.required],
        inventario: ['', Validators.required]
      })

      this.recepcionForm = this.fo.group({
        articulo: ['', Validators.required],
        tiporecepcion: ['', Validators.required],
        almacen: [''],
        inventario: ['', Validators.required]
      })

      this.articuloEditar = this.fo.group({
        id: [0],
        nombre: ['', Validators.required],
        precio: ['', Validators.required],
        topemin: ['', Validators.required],
        topemax: ['', Validators.required],
        inventario: ['', Validators.required]
      })

      this.ordenNueva = this.fo.group({
        articulo: ['', Validators.required],
        proveedor: ['', Validators.required],
        tipoorden: ['', Validators.required]
      })

      this.salidaForm = this.fo.group({
        articulo: ['', Validators.required],
        tiposalida: ['', Validators.required],
        almacen: [''],
        cantidad: ['', Validators.required]
      })

    }
    
    reloadPage() { 
      window.location.reload(); 
  } 

  guardar(values){
    this.articulosService.post(values).subscribe(() => {
      console.log('Insertado');
      this.reloadPage();
    },
    () => {
      console.log('No Insertado');
    }
    )
  }

  editar(id: number){
    this.articulosService.getOne(id).subscribe((values) => {
      //console.log(values);
      this.articuloEditar = this.fo.group({
        id: [values['id']],
        nombre: [values['nombre'], Validators.required],
        precio: [values['precio'], Validators.required],
        topemin: [values['topemin'], Validators.required],
        topemax: [values['topemax'], Validators.required],
        inventario: [values['inventario'], Validators.required]
      })
    })
  }

  guardareditar(values){
    //console.log(values);
    this.articulosService.put(values).subscribe((val) => {
      console.log('Editado');
      this.reloadPage();
    },
    () => {
      console.log('Error al editar');
    }
    )
  }

  delete(id: number){
    this.articulosService.delete(id).subscribe(() => {
      console.log('Borrado');
      this.reloadPage();
    },
    () => {
      console.log('No borrado');
    }
    )
  }    

  nuevaOrden(){
    this.articulosService.getArticulos().subscribe((resp: any) => {
      this.articulos = resp;
    });
    this.articulosService.getProveedores().subscribe((resp: any) => {
      this.proveedores = resp;
    });
  }
  
  guardarOrden(values){
    this.articulosService.postOrdenes(values).subscribe(() => {
      console.log('Orden Insertada');
      this.reloadPage();
    },
    () => {
      console.log('Orden No Insertada');
    }
    )
  }

  recepcion(){
    this.articulosService.getRecepciones().subscribe((resp: any) => {
      this.recepciones = resp;
    });
    this.articulosService.getAlmacenes().subscribe((resp:any) => {
      this.almacenes = resp;
    })
  }

  guardarRecepcion(values){
    //console.log(this.proveedor);
    Object.assign(values, {
      idproveedor: this.proveedor
    });
    console.log(values);
    this.articulosService.postRecepcion(values).subscribe(() => {
      console.log('Recepcion Insertada');
      this.articulosService.putInventario(values).subscribe(() => {
        console.log('Inventario Actualizado');
      },
      () => {
        console.log('Inventario No Actualizado');
      }
      )
      this.reloadPage();
    },
    () => {
      console.log('Recepcion No Insertada');
    }
    )
  }

  OnChangeArticulo(id){
    this.articulosService.getRecepcion(id).subscribe((resp: any) => {
      this.inventario = resp[0]['inventario'];
      let topemaxi = resp[0]['topemax'];
      this.topemax = topemaxi-this.inventario;
      this.topemin = 1;
      if(this.topemax==0){
        this.topemin = 0;
        this.oculto = false;
      }else{
        this.oculto = true;
      }
      this.proveedor = resp[0]['idproveedor'];
      //console.log(this.proveedor);
      this.mostrarinf1 = true;
    })
  }

  OnChangeArticuloSalida(id){
    this.articulosService.getRecepcion(id).subscribe((resp: any) => {
      this.inventario = resp[0]['inventario'];
      let topeminimo = resp[0]['topemin']
      this.topemin = 1;
      this.topemax = this.inventario-topeminimo;

      if(this.topemax==0){
        this.topemin = 0;
        this.oculto = false;
      }else{
        this.oculto = true;
      }
      this.proveedor = resp[0]['idproveedor'];
      //console.log(this.proveedor);
      this.mostrarinf = true;
    })
  }

  OnChangeTipo(value){
    if(value=='Almacen'){
      this.mostrar = true;
    }else{
      this.mostrar = false;
    }
  }

  salida(){
    this.articulosService.getSalidas().subscribe((resp: any) => {
      this.salidas = resp;
    });
    this.articulosService.getAlmacenes().subscribe((resp:any) => {
      this.almacenes = resp;
    })
  }

  guardarSalida(values){
    if(values['cantidad']==0){
      this.salidaForm.invalid;
    }else{
      Object.assign(values, {
        idproveedor: this.proveedor
      });
      console.log(values);
      this.articulosService.postSalida(values).subscribe(() => {
        console.log('Salida Insertada');
        this.articulosService.putInventarioSalida(values).subscribe(() => {
          console.log('Inventario Actualizado');
        },
        () => {
          console.log('Inventario No Actualizado');
        }
        )
        this.reloadPage();
      },
      () => {
        console.log('Recepcion No Insertada');
      }
      )
    }
  }
}
