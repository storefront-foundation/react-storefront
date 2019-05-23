// see https://html.spec.whatwg.org/multipage/forms.html#autofill-field
export default {
  // Location based autocomplete
  addressLine1: 'address-line1',
  addressLine2: 'address-line2',
  city: 'address-level2',
  zipCode: 'postal-code',
  state: 'address-level1',
  country: 'country-name',

  // Online ID based autocomplete
  email: 'email',
  password: 'current-password',
  newPassword: 'new-password',
  title: 'honorific-prefix',
  fullName: 'name',
  dob: 'bday',
  phone: 'tel',
  organization: 'org',

  // Credit card based autocomplete
  ccName: 'cc-name',
  ccType: 'cc-type',
  ccNumber: 'cc-number',
  ccExp: 'cc-exp',
  ccExpMonth: 'cc-exp-month',
  ccExpYear: 'cc-exp-year',
  ccCvv: 'cc-csc'
}
