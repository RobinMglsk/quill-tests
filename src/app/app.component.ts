import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
} from "@angular/forms";
import { CustomModule, CustomOption } from 'ngx-quill';
import Quill from 'quill';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  
})
export class AppComponent implements OnInit {
  textForm: FormGroup = new FormGroup({
    text: new FormControl(),
    title: new FormControl(),
  });

  quill: any;
  fontsize: string[] = this.sizes(5,50);

  colors: string[] = [];

  customOptions: CustomOption[] = [
    {
      import: 'formats/font',
      whitelist: ['Mirza', 'Roboto'],
    },
    {
      import: 'attributors/style/size',
      whitelist: this.fontsize,
    }
  ];

  customModules: CustomModule[] = [
    {
      path: Quill.import('attributors/style/size'),
      implementation: true
    }
  ];

  quillConfiguration = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ font: ['Mirza', 'Roboto', 'Unsupported font'] }],
      [{ size: this.fontsize}],
      [{ color: ['#000',  '#333', '#666','#FF0', '#F0F', '#0F0', '#FFF', 'custom-color'] }],
    ],
  };

  ngOnInit(){
    this.fontsize = this.sizes(5,50);
  }

  handleFontSizeUpdate(){
    const toolbar = this.quill.getModule('toolbar');
    console.log(toolbar);
  }

  handleEditorCreated(editor: Quill){
    console.log('handleEditorCreated called with', editor);
    this.quill = editor;

    const toolbar = this.quill.getModule('toolbar');
    console.log(toolbar)
    toolbar.addHandler('color', this.showColorPicker);
  }

  getColorsFromPicker(){
    const colors: string[] = [];
    const colorElements = document.querySelectorAll('.ql-color .ql-picker-options span');
    colorElements.forEach(e => {
      const color = e.getAttribute('data-value');
      if(color !== null){
        colors.push(color);
      }
    });
    console.log(colors)
    this.colors = colors;
  }

  showColorPicker(value: any) {
    console.log(value)
    if (value === 'custom-color') {
      
        const color = prompt("Show me some color!!!", "#000000");
        this.quill.format('color', color);

        const colors: string[] = [];
        colors.push(color as string);
        const colorElements = document.querySelectorAll('.ql-color .ql-picker-options span');
        colorElements.forEach(e => {
          const color = e.getAttribute('data-value');
          if(color !== null && color !== 'custom-color'){
            colors.push(color);
          }
        });

        const colorSelector = document.querySelector('.ql-color .ql-picker-options');
        (colorSelector as HTMLSpanElement).innerHTML = '';
        colors.splice(0,21).forEach( color => {
          const option = document.createElement('span');
          option.classList.add('ql-picker-item','ql-selected','ql-primary');
          option.setAttribute('data-value', color);
          option.setAttribute('tabindex', '0');
          option.setAttribute('role', 'button');
          option.style.backgroundColor = color;
          (colorSelector as HTMLSpanElement).appendChild(option);
        });

        const option = document.createElement('span');
        option.classList.add('ql-picker-item','ql-selected','ql-primary');
        option.setAttribute('data-value', 'custom-color');
        option.setAttribute('tabindex', '0');
        option.setAttribute('role', 'button');
        (colorSelector as HTMLSpanElement).appendChild(option);

        // this.quill.theme.baseT
        console.log(this.quill.theme.buildPickers())

    } else {
      this.quill.format('color', value);
    }
  }



  sizes(start: number, end: number): string[]{
    const sizes = [];
    for(let i = start; i <= end; i++){
      sizes.push(`${i}px`);
    }
    return sizes;
  }
}
