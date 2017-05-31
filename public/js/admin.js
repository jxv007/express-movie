$(function () {
    $(".del").click(function () {
        var id = $(this).data("id");
        var tr = $(".item-id-" + id);
        console.log(id,tr)
        $.ajax({
            type: 'DELETE',
            url: '/admin/list?id=' + id
        })
        .done(function (res) {
            if (res.success == 1) {
                if (tr.length > 0) {
                    tr.remove();
                }
            }
        })
    })
})
