$(document).ready(function () {

	// list page
	var ndCategory = $('#filter-category');
	var ndAuthor = $('#filter-author');
	var ndKeyword = $('#filter-keyword');

	$('#filter-submit').on('click', function () {
		var query = queryString.parse(location.search);
		var category = ndCategory.val();
		var author = ndAuthor.val();
		var keyword = ndKeyword.val();

		if (category) {
			query.category = category
		} else {
			delete query.category;
		}

		if (author) {
			query.author = author
		} else {
			delete query.author;
		}

		if (keyword) {
			query.keyword = keyword
		} else {
			delete query.keyword;
		}

		console.log(queryString.stringify(query));
		window.location.url = window.location.origin + window.location.pathname + queryString.stringify(query);

	});

	// // add page
	// if (typeof CKEDITOR !== 'undefined') {
	// 	CKEDITOR.replace('admin-post-content');
	// }
});