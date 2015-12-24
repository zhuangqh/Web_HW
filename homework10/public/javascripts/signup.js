/**
 * @Author: zhuangqh
 * @Email: zhuangqhc@gmail.com
 * @Create on: 2015/12/24
 */

$(function () {
  $("input:not(.button)").blur(valid);
  $('#submit').click(function () {
    if (!validator.isFormValid() && this.type === 'submit') return false;
  });

  $('#reset').click(function () {
    var $error = $('#error');
    $('#dupMessage').hide();
    $error.hide();
    $error.find('p').hide();
  });
});

function valid() {
  var self = this;
  if (validator.isFieldValid(this.id, $(this).val())) {
    $.post('/api/validate-unique', {field: this.id, value: $(this).val()}, function (data, status) {
      if (status === 'success') {
        if (data.isUnique) {
          getEleByFunc('Dup', self.id).hide();
        } else {
          validator.form[self.id + 'Status'] = false;
          getEleByFunc('Dup', self.id).show();
        }
      }
      switchError();
    });
    getEleByFunc('Err', this.id).hide();
  } else {
    getEleByFunc('Err', this.id).show();
    validator.form[this.id + 'Status'] = false;
  }
  switchError();
}

function switchError() {
  var $error = $('#error');
  $error.show();
  if (!$error.find('p:visible').length)
    $error.hide();
}

function getEleByFunc(name, id) {
  return $('#' + id + name);
}