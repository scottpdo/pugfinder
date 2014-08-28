$(document).ready(function(){

	var form = $('form'),
		zip = $('#zip'),
		content = $('#content');

	function getPugsByZip( e ) {

		e.preventDefault();

		content.html('');

		$.ajax({
			url: 'http://api.petfinder.com/pet.find?key=43f17b198413d28662c918a83e33dae0&animal=dog&breed=pug&location=' + zip.val() + '&format=json',
			dataType: 'jsonp',
			success: function(data) {
				
				var pets = data.petfinder.pets.pet;

				for ( var i = 0; i < pets.length; i++ ) {

					buildModule( pets[i] );

				}

			}
		});
	}

	form.submit( getPugsByZip );

	function showBio() {
		$(this).next().slideDown();
	}
	$('body').on('click', '[data-show="bio"]', showBio);

	function buildModule( pet ) {

		console.log(pet);
		//console.log(pet.breeds.breed.length);

		var panel = $('<div class="panel panel-default">'),
			panelBody = $('<div class="panel-body row">'),
			eightCol = $('<div class="col-sm-8">'),
			fourCol = $('<div class="col-sm-4">');

		var name = pet.name.$t,
			age = pet.age.$t;

		var breed = '';
		if ( !pet.breeds.breed.length ) {
			breed = pet.breeds.breed.$t; 
		} else {
			console.log(pet.breeds.breed);
			for ( var i = 0; i < pet.breeds.breed.length; i++ ) {
				breed += pet.breeds.breed[i].$t + ' / ';
			}
			// remove the last ' / '
			breed = breed.slice(0, -3);
		}

		var description = pet.description.$t,
			newDescription = '';
		description = description ? description.split(' ') : [];
		for ( var j = 0; j < description.length; j++ ) {
			newDescription += description[j];
			if (newDescription.length > 250) {
				newDescription += '...';
				break;
			} else {
				newDescription += ' ';
			}
		}
		description = newDescription;

		var id = pet.id.$t;

		eightCol
			.append('<h3 style="margin-top: 0;">' + name + '</h3>')
			.append('<p><strong>' + age + ' ' + breed + '</strong></p>')
			.append('<p data-show="bio"><a style="cursor: pointer;">Read about ' + name + ' &raquo;</a></p>')
			.append('<p style="display: none;">' + description + '</p>');

		if ( pet.media.photos ) {
			fourCol.append('<a href="http://www.petfinder.com/petdetail/' + id + '" target="_blank"><img src="' + pet.media.photos.photo[0].$t + '" class="img-thumbnail center-block"></a>');
		} else {
			fourCol.append('<p>No photos available.</p>');
		}

		panelBody.append( eightCol ).append( fourCol );

		panel.append( panelBody ).appendTo( content );

	}

});