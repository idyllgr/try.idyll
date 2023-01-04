import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SharedClasses} from "../../classes/SharedClasses";
import {ModalDismissReasons, NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NgSelectComponent} from "@ng-select/ng-select";
import {UserService} from "../../../app/network/services";
import {UserStore} from "../../store/user.store";
import {MainStore} from "../../store/mainStore";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
    submittingRatinngForm: boolean;
    ratingForm: FormGroup;
    ratingStars;
    closeResult;
    baseStars = 5;
    $env = environment;
    @ViewChild('contentRating') contentRating: ElementRef;


    constructor( private fb: FormBuilder,
                 private modal: NgbActiveModal,
                 private userStore: UserStore,
                 public mainStore: MainStore,
                 private modalService: NgbModal, private userService: UserService) { }

  ngOnInit(): void {
      this.ratingForm = this.fb.group({
          customer_message: ['Hello, i love this one, can i have more information about how to get it']
      });
  }

    chooseRating($event: number) {
        console.log('event rating', $event)
        this.ratingStars = $event;
    }

    async sendEmail() {
        try {
            const res = await this.userService.sendRating({
                message: this.ratingForm.value.customer_message,
                rating_percent: this.ratingStars / this.baseStars * 100,
                business_id: this.mainStore.selectedBusiness.id,
                user_id: this.userStore.getAuthenticatedUser? this.userStore.getAuthenticatedUser.id : null
            }).toPromise();
        }catch (e){
            console.log('e', e);
        }finally {
            this.modal.dismiss('QUERY');
        }



        console.log('send', this.ratingStars, this.ratingForm.value);
    }

    getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    open(content) {

        if(!this.modalService){
            return;
        }
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }
}
