//Storage Controller
    const StorageCtrl = (function(){
        //Public methods
        return{
            storeItem: function (item){
                let items;
                //check if items in local storage
                if(localStorage.getItem('items') === null){
                    items = [];
                    //push new item
                    items.push(item);
                    // set local storage
                    localStorage.setItem('items', JSON.stringify(items));
                }else{
                    //get what is already in local storage
                    items = JSON.parse(localStorage.getItem('items'));

                    //push new item 
                    items.push(item);

                    //reset local storage 
                    localStorage.setItem('items', JSON.stringify(items));
                }
            },
            getItemsFromStorage: function(){
                let items;
                if(localStorage.getItem('items') === null){
                    items = [];
                } else {
                    items = JSON.parse(localStorage.getItem('items'));
                }
                return items;
            },
            updateItemStorage: function(updatedItem){
                let items = JSON.parse(localStorage.getItem('items'));

                items.forEach(function(item, index){
                    if(updatedItem.id === item.id){
                        items.splice(index, 1, updatedItem);
                    }
                });
                localStorage.setItem('items', JSON.stringify(items));
            },
            deleteItemFromStorage: function(id){
                let items = JSON.parse(localStorage.getItem('items'));

                items.forEach(function(item, index){
                    if(id === item.id){
                        items.splice(index, 1);
                    }
                });
                localStorage.setItem('items', JSON.stringify(items));
            },
            clearItemsFromStorage: function(){
                localStorage.removeItem('items');
            }
        }
    })();
//Item controller
const ItemCtrl = (function(){
    //Item constructor
    const Item = function(id, name, calories){
        this. id = id;
        this.name = name;
        this.calories = calories;
    }

    //Data Structure / state
    const data = {
        // items: [
        //     // { id: 0, name: 'Steak Dinner', calories: 1200},
        //     // { id: 1, name: 'Cookies', calories: 400},
        //     // { id: 2, name: 'Pasta', calories: 1000}
        // ],
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories:0
    }
    return{
        getItems: function(){
            return data.items;
        },
        addItem: function(name, calories){
            let ID;
            //Create id 
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1;
            }else {
                ID = 0;
            }

            //Calories to number
            calories = parseInt(calories);

            //create new item 
            newItem = new Item (ID, name, calories);
            
            //Add to items array
            data.items.push(newItem);

            return newItem;
        },
        getItemById: function(id){
            let found  = null;
            //loop through the items
            data.items.forEach(function(item){
                if (item.id === id){
                    found = item;
                }
            });
            return found;
        },
        updateItem: function(name, calories){
            //calories to number
            calories = parseInt(calories);

            let found = null ;

            data.items.forEach(function(item){
                if (item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        deleteItem: function(id){
            //Get the id's
            const ids = data.items.map(function(item){
                return item.id;
            });

            //get the index
            const index = ids.indexOf(id);

            //Remove item 
            data.items.splice(index, 1);
        },
        clearAllItems: function(){
            data.items = [];
        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        getCurrentItem: function(){
            return data.currentItem;
        },
        getTotalCalories: function(){
            let total = 0;

            //loop through items and add calories
            data.items.forEach(function(item){
                total += item.calories;
            });

            // set total cal in data structure
            data.totalCalories = total;

            //return total
            return data.totalCalories;
        },
        logData: function(){
            return data;
        }
    }
})();

//UI Controller
const UICtrl = (function(){
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }

    return {
        populateItemList: function(items){
            let html =''
            items.forEach(function(item){
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i> </a>
                </li>`
            });

            //insert list items 
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function(){
            return {
                name:document.querySelector(UISelectors.itemNameInput).value,
                calories:document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item) {
            //Show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            //create li elements
            const li = document.createElement('li');
            //add class
            li.className = 'collection-item';
            //add ID
            li.id = `item-${item.id}`;

            // add HTMl
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i> </a>`;
            //insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
        },
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //turn node list into array 
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i> </a>`;
                }
            })
        },
        deleteListItem: function(id){
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },

        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        removeItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //turn node list into an array
            listItems = Array.from(listItems);
            listItems.forEach(function(item){
                item.remove();
            });
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function (){
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function (){
            
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        getSelectors: function(){
            return UISelectors;
        }
    }
})();

//App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl){
    //Load Event Listeners
    const loadEventListeners = function(){
        //Get Ui selectors
        const UISelectors = UICtrl.getSelectors();

        //Add Item Event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        //disable submit on enter
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        });

        //Edit icon click event 
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        // Update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        // delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        //back button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

        // clear item event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
    }

    //Add Item Submit
    const itemAddSubmit = function(e){
        //Get form input from UI controller
        const input = UICtrl.getItemInput();

        //check for name and calories input
        if(input.name !== '' && input.calories !== ''){
            //Add item 
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            //Add item to UI list
            UICtrl.addListItem(newItem);

            // get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //Add total calories to UI 
            UICtrl.showTotalCalories(totalCalories);

            //Store in localStorage
            StorageCtrl.storeItem(newItem);

            // clear fields
            UICtrl.clearInput();
        }

        e.preventDefault();
    }
    // click edit item
    const itemEditClick = function(e){
        if(e.target.classList.contains('edit-item')){
            //Get list item id 
            const listId = e.target.parentNode.parentNode.id;

            //break into an array 
            const listIdArr = listId.split ('-');

            //Get the actual id
            const id = parseInt(listIdArr[1]);

            //get item
            const itemToEdit = ItemCtrl.getItemById(id);

            //set  current item
            ItemCtrl.setCurrentItem(itemToEdit);

            //Add item to form
            UICtrl.addItemToForm();
        }
        e.preventDefault();
    }

    //update item submit
    const itemUpdateSubmit = function(e){
        //get item input
        const input = UICtrl.getItemInput();

        //update item 
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        //update UI 
        UICtrl.updateListItem(updatedItem);

        // get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //Add total calories to UI 
        UICtrl.showTotalCalories(totalCalories);

        //Update Local Storage
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    // delete button submit
    const itemDeleteSubmit = function(e) {
        // Get current item
        const currentItem = ItemCtrl.getCurrentItem();

        //delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        // Delete from UI 
        UICtrl.deleteListItem(currentItem.id);

        // get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //Add total calories to UI 
        UICtrl.showTotalCalories(totalCalories);

        //Delete from Local storage
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        // clear fields
        UICtrl.clearEditState();

        e.preventDefault();
    }

    //clear items event
    const clearAllItemsClick = function(){
        //delete all items from data structure
        ItemCtrl.clearAllItems();

        // get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //Add total calories to UI 
        UICtrl.showTotalCalories(totalCalories);


        //remove from UI
        UICtrl.removeItems();

        //clear from local storage
        StorageCtrl.clearItemsFromStorage();


        //hide UL
        UICtrl.hideList();
    }


    //public methods
    return {
        init: function(){
            //Clear edit state /set initial state
            UICtrl.clearEditState();

            //Fetch item from data structure
            const items = ItemCtrl.getItems();

            // check if any items 
            if(items.length === 0) {
                UICtrl.hideList();
            } else {
                //populate list with items
                UICtrl.populateItemList(items);
            }

            // get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //Add total calories to UI 
            UICtrl.showTotalCalories(totalCalories);
            

            //Load event listeners
            loadEventListeners();
        }
    }
})(ItemCtrl, StorageCtrl, UICtrl);

//initialize App
App.init();