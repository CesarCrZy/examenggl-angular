import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})


export class ArticulosService {

  public headers: any;
  public url = "https://apirest-examen.herokuapp.com";
  constructor(
    private http:HttpClient
  ) { 
    const headerDict = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
    this.headers = headerDict;
  }


  getArticulos(){
    return this.http.get(this.url+'/api/GetAll', this.headers);
  }

  getOne(id: number){
    return this.http.get(this.url+'/api/GetOne/'+id)
  }

  delete(id: number){
    return this.http.delete(this.url+'/api/Delete/'+id);
  }

  post(values){
    return this.http.post(this.url+'/api/Post', values)
  }

  put(values){
    return this.http.put(this.url+'/api/Put/'+values['id'], values);
  }

  putInventario(values){
    return this.http.put(this.url+'/api/PutInventario/'+values['articulo'], values);
  }

  putInventarioSalida(values){
    return this.http.put(this.url+'/api/PutInventarioSalida/'+values['articulo'], values);
  }

  getProveedores(){
    return this.http.get(this.url+'/api/GetProveedores');
  }

  getAlmacenes(){
    return this.http.get(this.url+'/api/GetAlmacenes');
  }

  postOrdenes(values){
    return this.http.post(this.url+'/api/PostOrden', values);
  }

  postRecepcion(values){
    return this.http.post(this.url+'/api/PostRecepcion', values);
  }

  postSalida(values){
    return this.http.post(this.url+'/api/PostSalida', values);
  }

  getRecepciones(){
    return this.http.get(this.url+'/api/GetRecepciones');
  }

  getRecepcion(id: number){
    return this.http.get(this.url+'/api/GetRecepcion/'+id)
  }

  getSalidas(){
    return this.http.get(this.url+'/api/GetSalidas');
  }
}
