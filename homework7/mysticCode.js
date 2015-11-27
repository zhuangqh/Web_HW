(function ($) {
    $('table').find('th').click(sortTable);

    function sortTable() {
        var sortIcon = $(this).find('.sort-icon'),
            originalClassName = sortIcon.attr('class');
        $('.sort-icon').attr('class', 'sort-icon');
        sortIcon.addClass(originalClassName);
        setIconAndSort.call(this, sortIcon);

        $('th').removeClass('selected');
        $(this).addClass('selected');
    }

    function setIconAndSort(sortIcon) {
        var isAscend = true;
        if (sortIcon.hasClass('descend')) {
            sortIcon.removeClass('descend').addClass('ascend');
        } else if (sortIcon.hasClass('ascend')) {
            sortIcon.removeClass('ascend').addClass('descend');
            isAscend = false;
        } else {
            sortIcon.addClass('ascend');
        }
        sortRow.call(this, isAscend);
    }

    function sortRow(isAscend) {
        var colIndex = $(this).index(),
            $tbody= $(this).parent().parent().parent().find('tbody'),
            rows = $tbody.find('tr').get();
        rows.sort(function (rowA, rowB) {
            return rowA.cells[colIndex].textContent > rowB.cells[colIndex].textContent;
        });
        if (!isAscend) rows.reverse();

        $tbody.html('');
        $tbody.append(rows);
    }
})(jQuery);