function FormStripe(form) {
  this.form = form;

  this.init = function () {
    var stripe = Stripe(this.form.props.stripe_public_key);
    var elements = stripe.elements();

    var cardnumber = elements.create('cardNumber', { placeholder: "" });
    var cardexpiry = elements.create('cardExpiry');
    var cardCvc = elements.create('cardCvc', { placeholder: "" });
    cardnumber.mount(this.form.$dom.find('.formpay-card-number')[0]);
    cardexpiry.mount(this.form.$dom.find('.formpay-card-expiry')[0]);
    cardCvc.mount(this.form.$dom.find('.formpay-card-cvc')[0]);

    cardnumber.addEventListener('change', function(event) {
      $err = $(cardnumber._component).parents(".formbuilder-element").find(".formbuilder-errors");
      $err.text(event.error ? event.error.message : "");
    });

    cardexpiry.addEventListener('change', function(event) {
      $err = $(cardexpiry._component).parents(".formbuilder-element").find(".formbuilder-errors").eq(0);
      $err.text(event.error ? event.error.message : "");
    });

    cardCvc.addEventListener('change', function(event) {
      $err = $(cardCvc._component).parents(".formbuilder-element").find(".formbuilder-errors").eq(1);
      $err.text(event.error ? event.error.message : "");
    });

    this.form.$dom.find(".stripe-form")[0].addEventListener('submit', function(event) {
      event.preventDefault();
      if (this.form.validate_cardholder()) {
        this.form.loading();
        stripe.createToken(cardnumber, { name: this.form.$dom.find(".formpay-cardholder").val() }).then(function(result) {
          if (result.error) {
            this.form.loading();
            $err = $(cardnumber._component).parents(".formbuilder-element").find(".formbuilder-errors");
            $err.text(result.error.message);
          }
          else {
            // Send the token to your server
            this.token_handler(result.token);
          }
        }.bind(this));
      }
    }.bind(this));
  }

  this.token_handler = function(token) {
    var form = this.form.$dom.find(".stripe-form")[0];
    var hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'stripeToken');
    hiddenInput.setAttribute('value', token.id);
    form.appendChild(hiddenInput);
    form.submit();
  }

}