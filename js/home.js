$(document).ready(function () {
    load_products();
    add_money();
    select_product_to_purchase();
    complete_purchase();
    change_return();
});

//retrieving all items
function load_products() {
    $.ajax({
        type: "get",
        url: "http://tsg-vending.herokuapp.com/items",
        success: function (product_array) {
            $.each(product_array, function (index, product) {
                var prod_box = '<div class="col-md-3 get_product" data-id="'
                    + product.id + '"><p>' + product.id + "</p>" +
                    "<p class='name'>" + product.name + "</p>" +
                    "<p class='price'>" + "$" + product.price.toFixed(2) + "</p>" +
                    "<p class='stock'>" + "Items In Stock: " + product.quantity + "</p>" + "</div>";

                $("#prod_details").append(prod_box);
            });
        },
        error: function () {

        }
    });
}

//adding money
function add_money() {
    var total = 0;
    //add_dollar
    $("#add_dollar").on("click", function () {
        total = (Number(total) + Number(1));
        $("#total_in").val(total.toFixed(2));
    })
    //add_quarter
    $("#add_quarter").on("click", function () {
        total = (Number(total) + Number(.25));
        $("#total_in").val(total.toFixed(2));
    })
    //add_dime
    $("#add_dime").on("click", function () {
        total = (Number(total) + Number(.10));
        $("#total_in").val(total.toFixed(2));
    })
    //add_nickel
    $("#add_nickel").on("click", function () {
        total = (Number(total) + Number(.05));
        $("#total_in").val(total.toFixed(2));
    })
}

//select product
function select_product_to_purchase() {
    $("#prod_details").on("click", ".get_product", function () {
        var id = $(this).data("id");
        $("#product_selection").val(id);
    });
}

//vending an item
function complete_purchase() {
    $("#make_purchase").on("click", function () {
        var amount = $("#total_in").val();
        var id = $("#product_selection").val();

        $.ajax(
            {
                type: "post",
                url: "http://tsg-vending.herokuapp.com/money/" + amount + "/item/" + id,
                success: function (change) {

                    var vend_success = "Thank You!!!";
                    var quarters = change.quarters;
                    var dimes = change.dimes;
                    var nickels = change.nickels;
                    var pennies = change.pennies;

                    var get_change =
                        "Quarters: " + quarters +
                        " Dimes: " + dimes +
                        " Nickels: " + nickels +
                        " Pennies: " + pennies;

                    $("#messages").val(vend_success);
                    $("#change").val(get_change);
                    $("#total_in").val(0);
                    $("#product_selection").val("");
                    load_products();

                },
                error: function (error) {
                    if (id == "") {
                        var show_message = "Select a product!";
                    }
                    else {
                        var show_message = error.responseJSON.message;
                    }
                    $("#messages").val(show_message);
                }
            })
    });
}
//change return -- no purchase made
function change_return() {
    $("#change_return").click(function () {
        var coins = $("#total_in").val() * 100;
        var quarters2 = Math.floor(coins / 25);
        var dimes2 = Math.floor((coins - (quarters2 * 25)) / 10);
        var nickels2 = Math.floor(((coins - ((quarters2 * 25) + (dimes2 * 10))) / 5));
        //no change for pennies since we don't have a button to insert pennies to return
        var get_change2 =
            "Quarters: " + quarters2 +
            " Dimes: " + dimes2 +
            " Nickels: " + nickels2;

        $("#change").val(get_change2);
        setTimeout(location.reload.bind(location), 5000);

    });
}


