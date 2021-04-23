import { Component, OnInit ,Input} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators , FormArray} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '../../services/notification.service';
import { ProviderService } from '../../services/provider.service';
import { requiredFileType, uploadProgress, toResponseBody,markAllAsDirty, toFormData } from '../file-upload/upload-file-validators';

@Component({
  selector: 'app-create-provider',
  templateUrl: './create-provider.component.html',
  styleUrls: ['./create-provider.component.scss']
})
export class CreateProviderComponent implements OnInit {
  @Input() selectedProvider : any;
  // progress = 0;
  providerForm : FormGroup;
  formSubmitted = false;
  Types: Array<any> = ['Med Management' , 'Psychotherapy', 'Scale Management'
    // { name: 'Med Management', value: 'Med Management', 'check':true },
    // { name: 'Psychotherapy', value: 'Psychotherapy', 'check':false },
    // { name: 'Case Management', value: 'Case Management', 'check':  true}
  ];

  constructor(public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private providerService : ProviderService,
    private router: Router,
    private notifyService : NotificationService) { }

  ngOnInit() {
    if(this.selectedProvider != undefined){
      this.editForm();
    }
    else{
    this.createForm();
    }
  }

  createForm(){
    this.providerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      providerTypes: this.formBuilder.array(this.Types.map(x => !1))
      // image: new FormControl(null, [Validators.required, requiredFileType('png')])
    });
  }

  editForm(){
    this.providerForm = this.formBuilder.group({
      firstName: [this.selectedProvider.firstName, Validators.required],
      lastName: [this.selectedProvider.lastName, Validators.required],
      // userRole: ['provider'],
      providerTypes: this.formBuilder.array(this.Types.map(x => this.selectedProvider.providerTypes.indexOf(x) > -1)),
      providerId: [this.selectedProvider._id,Validators.required],
      activeStatus: [this.selectedProvider.activeStatus,Validators.required]
    });
  }

  get f() { return this.providerForm.controls; }

  submitForm(){
    this.formSubmitted = true;
    if(this.providerForm.invalid) {
      // markAllAsDirty(this.providerForm)
      return; }
    if(this.selectedProvider != undefined){
      this.updateProvider();
    }else{
      this.newProvider();
    }
  }

  // hasError( field: string, error: string ) {
  //   const control = this.providerForm.get(field);
  //   return control.dirty && control.hasError(error);
  // }

  getConvert(){
    return Object.assign({}, this.providerForm.value, {
      providerTypes: this.convertToValue('Types', 'providerTypes')
    });
  }

  updateProvider(){
    this.providerService.updateProvider(this.getConvert()).subscribe(
      (data: any) => {
        this.notifyService.showSuccess('Provider Updated Successfully',"");
        this.activeModal.close(this.providerForm.value);
      },
      (err: HttpErrorResponse) => {
        if (err.error.error) {
          this.notifyService.showError(err.error.error,"");
        }
        else if(err.error.msg){
          this.notifyService.showError(err.error.msg,"");
        } else {
          this.notifyService.showError("Something went wrong","");
        }
      }
    );
  }

  convertToValue(key: string, key1: string) {
    return this.providerForm.value[key1].map((x, i) => x && this[key][i]).filter(x => !!x);
  }

  newProvider(){
    this.providerService.createProvider(this.getConvert())
      .subscribe(
        (data: any) => {
          // this.progress = 0;
          this.notifyService.showSuccess('Provider Created Successfully',"");
          this.activeModal.close(this.providerForm.value);
        },
        (err: HttpErrorResponse) => {
          if (err.error.error) {
            this.notifyService.showError(err.error.error,"");
          }
          else if(err.error.msg){
            this.notifyService.showError(err.error.msg,"");
          } else {
            this.notifyService.showError("Something went wrong","");
          }
      });
  }
}
