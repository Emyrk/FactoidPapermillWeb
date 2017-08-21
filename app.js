'use strict'

// require('jsdom').env('', function (err, window) {
//   if (err) {
//     console.error(err)
//     return
//   }

//   var $ = require('jquery')(window)
// })

let wallet

var fctUtils = require('factomjs-util')
var factombip44 = require('factombip44')
var $ = require('jquery')

$('#random-address-button').on('click', function () {
  var key = fctUtils.randomPrivateKey()
  $('#private-key').text(fctUtils.privateFactoidKeyToHumanAddress(key))
  $('#public-key').text(fctUtils.publicFactoidKeyToHumanAddress(fctUtils.privateKeyToPublicKey(key)))
})

$('#choose-seed').on('click', function () {
  wallet = new factombip44.FactomBIP44($('#seed-input').val())
  $('#address-table').html('')
  var chain = wallet.getFactoidChain(0, 0)
  for (var i = 0; i < 10; i++) {
  	var key = chain.next()
  	$('#address-table').append(`
<tr>
	<td> ` + i + ` </td>
	<td> ` + fctUtils.privateFactoidKeyToHumanAddress(key) + ` </td>
	<td> ` + fctUtils.publicFactoidKeyToHumanAddress(fctUtils.privateKeyToPublicKey(key)) + ` </td>
</tr>
  		`)
  	$('#seed-display-container').css('display', 'block')
  	$('#address-table-container').css('display', 'block')
  }
  $('#seed-inputted').text($('#seed-input').val())
  console.log($('#seed-input').val())
})

$('#verify').on('click', function () {
  var hkey = $('#validate-key').val()
  var resp = ''
  if (!fctUtils.isValidAddress(hkey)) {
 	$('#validate-container').css('background', '#dba4b3')
 	$('#verify-result').html('Not a valid address')
 	return
  }

  $('#validate-container').css('background', '#7EF79B')
  if (hkey.slice(0, 2) === 'Fs') {
  	var hpub = fctUtils.publicFactoidKeyToHumanAddress(fctUtils.privateKeyToPublicKey(fctUtils.privateHumanAddressStringToPrivate(hkey)))
  	var resp = 'Given address is a private key. The public key is:'
  	resp += `<pre>` + hpub + `</pre>`
  	resp += `<a href="https://explorer.factom.org/address/` + hpub + `">` + 'Explorer Link' + `</a>`

  	$('#verify-result').html(resp)
  } else {
    $('#verify-result').html('The given address is a valid address' +
     `<br /><a href="https://explorer.factom.org/address/` + hkey + `">` + 'Explorer Link' + `</a>`)
  }
})
