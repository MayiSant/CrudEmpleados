import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { EmpleadoModelo } from './empleado-dashboard.model';

@Component({
  selector: 'app-empleado-dashboard',
  templateUrl: './empleado-dashboard.component.html',
  styleUrls: ['./empleado-dashboard.component.css']
})
export class EmpleadoDashboardComponent implements OnInit {

  formModel !: FormGroup;
  empleadomodelObj : EmpleadoModelo = new EmpleadoModelo();
  empleadoData : any;
  resultado!: string;

  
  constructor(private formbuilder: FormBuilder, private api : ApiService) {
    this.formModel=this.formbuilder.group({
      //variables donde se almacenaran los datos ingresados por el usuario
      firstName : ['', Validators.required],
      lastName : ['', Validators.required],
      email : ['', [Validators.required, Validators.email]],
      mobile : ['', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]],
      salary : ['', Validators.required]
    })
    
   }

  
 ngOnInit(): void {
  console.log("Entrar onInit");
  this.getAllEmpleado();
  if(this.empleadoData){
    console.log("entro")
  }
    
 }
  //llamada de los metodos de visualizacion, insercion, eliminacion y atualizacion 
  postEmpleadoDetails(){
    if(this.formModel?.invalid){
      alert("los Campos deben ser llenados")
      return ;
    
    }
    else{
      this.getAllEmpleado();
    this.empleadomodelObj.firstName=this.formModel.value.firstName;
    this.empleadomodelObj.lastName=this.formModel.value.lastName;
    this.empleadomodelObj.email=this.formModel.value.email;
    this.empleadomodelObj.mobile=this.formModel.value.mobile;
    this.empleadomodelObj.salary=this.formModel.value.salary;

    this.api.postEmpleado(this.empleadomodelObj).subscribe(res =>{
      console.log(res);
      alert("Empleado Agregado Correctamente")
      let ref=document.getElementById('cancel')
      ref?.click();
      this.formModel.reset();
      this.getAllEmpleado();
    },
    err=>{
      alert("Algo Salio Mal")
    })
    }
  
  }

  getAllEmpleado(){
    this.api.getEmpleado().subscribe(res=>{
      this.empleadoData = res as EmpleadoModelo[];
      console.log(this.empleadoData);
    })
  }

  deleteEmpleado(row:any){
    this.api.deleteEmpleado(row.id).subscribe(res=>{
      alert("Empleado Eliminado")
      this.empleadoData=[]
      this.getAllEmpleado();
    })
  }

  onEdit(row : any){
    this.empleadomodelObj.id=row.id;
    this.formModel.controls['firstName'].setValue(row.firstName);
    this.formModel.controls['lastName'].setValue(row.lastName);
    this.formModel.controls['email'].setValue(row.email);
    this.formModel.controls['mobile'].setValue(row.mobile);
    this.formModel.controls['salary'].setValue(row.salary);
  }
  updateEmpleadoDetails(){
    this.empleadomodelObj.firstName=this.formModel.value.firstName;
    this.empleadomodelObj.lastName=this.formModel.value.lastName;
    this.empleadomodelObj.email=this.formModel.value.email;
    this.empleadomodelObj.mobile=this.formModel.value.mobile;
    this.empleadomodelObj.salary=this.formModel.value.salary;

    this.api.updateEmpleado(this.empleadomodelObj, this.empleadomodelObj.id)
    .subscribe(rest=>{
      alert("Registro Actualizado Correctamente");
      let ref= document.getElementById('cancel')
      ref?.click();
      this.formModel.reset();
      this.getAllEmpleado();
    })
  }

}
