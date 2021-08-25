import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {AbstractControl, NgForm} from '@angular/forms';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-onboard-user',
  templateUrl: './onboard-user.component.html',
  styleUrls: ['./onboard-user.component.scss']
})

export class OnboardUserComponent implements OnInit {
  checkDigisafeVariants = [
    { value: 1, label: 'I have a physical secure location - You will have custodial responsibilities to store items in secure, ' +
      'confidential, environmentally controlled location(s) for physical collectibles.'},
    { value: 2, label: 'I have/ can get insurance  - Digisafe inventory must be insured. You will be asked later to provide copy of ' +
      'binder and all riders.'},
    { value: 3, label: 'I have researched all the required certificates and licenses required by law if any for the jurisdictions I ' +
      'plan to operate in as a collectibles storage/processing facility.'},
    { value: 4, label: 'I guarantee I will be able to process shipping/processing requests within 48 hours from the time of request.'},
    { value: 5, label: 'I guarantee that I will visually authenticate all items to be processed by my facility + verify authentication ' +
      'by scanning barcode. I will do my utmost best to help ensure that fraudulent / fake items do not get added to the platform.' },
    { value: 6, label: 'I understand checking these boxes does not mean I will be guaranteed an opportunity to participate as ' +
      'a Digisafe Operator.' },
    { value: 7, label: 'I will provide my location for my proposed Digisafe location (city, state/region, country) in the other text box ' +
      'below.' },
  ];

  socialRegEx = {
    twitter: '^(http(s)?:\\/\\/)?(www\\.)?twitter\\.com\\/[A-z 0-9 _]{1,15}\\/?$',
    instagram: '^(http(s)?:\\/\\/)?(www\\.)?instagram\\.com/[a-z].{3,}',
    twitch: '^(?:https?:\\/\\/)?(?:www\\.|go\\.)?twitch\\.tv\\/([a-z0-9_]+)($|\\?)'
  };

  obUserForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {
    // Create a FormControl for each available digisafe variants, initialize them as unchecked, and put them in an array
    const formControls = this.checkDigisafeVariants.map(control => new FormControl(false));

    this.obUserForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      walletAddress: ['', Validators.required],
      profileName: ['', Validators.required],
      twitter: ['', Validators.pattern(this.socialRegEx.twitter)],
      instagram: ['', Validators.pattern(this.socialRegEx.instagram)],
      twitch: ['', Validators.pattern(this.socialRegEx.twitch)],
      checkDigisafeVariants: new FormArray(formControls),
      facility: [''],
    });
  }

  ngOnInit(): void {
  }

  onCheckboxChange(e): void {
    const checkDigisafeVariants: FormArray = this.obUserForm.get('checkDigisafeVariants') as FormArray;

    if (e.target.checked) {
      checkDigisafeVariants.push(new FormControl(e.target.value));
    } else {
      let i = 0;
      checkDigisafeVariants.controls.forEach((item: FormControl) => {
        if (item.value === e.target.value) {
          checkDigisafeVariants.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  resetDigisafeVariants(): void {
    const checkDigisafeVariants: FormArray = this.obUserForm.get('checkDigisafeVariants') as FormArray;

    if (checkDigisafeVariants.length > 0) {
      while (checkDigisafeVariants.length !== 0) {
        checkDigisafeVariants.removeAt(0);
      }
    }
    this.cdr.detectChanges();
  }

  onboardForm(): void {
    console.log(this.obUserForm.value);
  }

  onboardFormReset(): void {
    this.obUserForm.reset();
    console.log(this.obUserForm.value);
  }

  getControls(): AbstractControl[] {
    return (this.obUserForm.get('checkDigisafeVariants') as FormArray).controls;
  }
}
