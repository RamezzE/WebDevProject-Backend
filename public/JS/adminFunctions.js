
function deleteUser(userID) {
    
    var deleteForm = document.createElement('form');
    deleteForm.method = 'POST';
    deleteForm.action = '/dashboard/users/delete';

    var userIdInput = document.createElement('input');
    userIdInput.type = 'hidden';
    userIdInput.name = 'userID';
    userIdInput.value = userID;

    deleteForm.appendChild(userIdInput);
    document.body.appendChild(deleteForm);

    deleteForm.submit();
}