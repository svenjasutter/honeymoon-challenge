import { Component, OnInit, TemplateRef } from '@angular/core';
import { ToastService } from './toast.service';


@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  host: {
    class: 'toast-container position-fixed bottom-0 p-3',
    style: 'z-index: 1200',
  },
})
export class ToastComponent implements OnInit {

  constructor(public toastService :ToastService) { }

  ngOnInit(): void {
  }

  isTemplate(toast) {
    return toast.textOrTpl instanceof TemplateRef;
  }

}
