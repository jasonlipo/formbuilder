function FormStructure(builder) {

  this.builder = builder;

  this.zip = function () {
    return {
      name: this.builder.name,
      description: this.builder.description,
      elements: $.map(this.builder.elements, function (i) {
        return i.zip();
      })
    }
  }

  this.json = function () {
    return JSON.stringify(this.zip());
  }

}