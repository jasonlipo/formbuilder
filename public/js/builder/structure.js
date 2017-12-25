function FormStructure(builder) {

  this.builder = builder;

  this.zip = function () {
    return {
      props: this.builder.props,
      elements: $.map(this.builder.elements, function (i) {
        return i.zip();
      })
    }
  }

  this.json = function () {
    return JSON.stringify(this.zip());
  }

}