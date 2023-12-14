import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import * as url from "url";
import {update} from "@angular-devkit/build-angular/src/tools/esbuild/angular/compilation/parallel-worker";
import {ProductService} from "../services/product.service";
import {Product} from "../model/product.model";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {AppStateService} from "../services/app-state.service";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit{
  /* //table des données statique
  products:Array<any>=[
    {id:1,name:"computer",price:3000,checked:false},
    {id:1,name:"Pinter",price:5000,checked:true},
    {id:1,name:"Phone",price:10000,checked:false},
  ];*/
 public products:Array<Product>=[];
 public keyword:string="";
 totalPages:number=3;
 pageSize:number=3;
 currentPage:number=1;


//injection des dépendence
  constructor(private productService:ProductService,
              private router:Router,public appState:AppStateService) {
  }
  ngOnInit(){
    this.searchProducts();
  }
  searchProducts(){
   /* this.appState.setProductState({
      status:"LOADING"
    });*/
    this.productService.searchProduct(this.appState.productsState.keyword,
      this.appState.productsState.currentPage,
      this.appState.productsState.pageSize)
      .subscribe({

        next: (resp) => {
          let products=resp.body as Product[];
          let totalProducts:number=parseInt(resp.headers.get('x-total-count')!);

          //this.appState.productsState.totalProducts=totalProducts;

          let totalPages=Math.floor(totalProducts / this.appState.productsState.pageSize);
          if(totalProducts % this.appState.productsState.pageSize !=0){
            ++totalPages;

          }
          this.appState.setProductState({
            products:products,
            totalProducts:totalProducts,
            totalPages:totalPages,
          status:"LOADED"
          })
        },
        error: (err) => {
         this.appState.setProductState({
           status:"ERROR",
           errorMessage:err
         })
        }

      });
    //this.products$=this.productService.getProduct();
  }


  handleChekProduct(product:Product) {
    this.productService.checkProduct(product)
      .subscribe(
      {
        next:updatedProduct=>{
        product.checked=!product.checked
        }
      })
  }

  handleDeleteProduct(product: Product) {
    if(confirm("Etes vous sure de vouloir supprimer ?"))
this.productService.deleteProduct(product).subscribe({
  next:value => {
   // this.getProducts();
    //this.appState.productsState.products=
      //this.appState.productsState.products.filter((p:any)=>p.id!=product.id);
    this.searchProducts()
  }
})

  }

  handleGotoPage(page: number) {
    this.appState.productsState.currentPage=page;
    this.searchProducts()

  }

  handleEditProduct(product: Product) {
this.router.navigateByUrl(`/admin/editProduct/${product.id}`)
  }
}

