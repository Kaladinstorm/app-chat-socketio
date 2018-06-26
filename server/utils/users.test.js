const expect = require('expect');

const Users = require('./users');


describe('Users', () => {
    var users;
    //Esto se ejecuta antes de cada test
    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'Juan',
            room: 'Code Node'
        },
        {
            id: '2',
            name: 'Luis',
            room: 'Java Code'
        },
        {
            id: '3',
            name: 'Miguel',
            room: 'Code Node'
        }]
    });

    it('should add a new user', () => {
        var users = new Users();
        var user = {id:'123', name:'juan', room: 'Pencas'};
        var resUser = users.addUser(user.id, user.name, user.room);
        //Se pone en [] porque es un arreglo el users de la clase
        expect(users.users).toEqual([user]);
    });

    it('should return names for Code Node rooms', () => {
        var userList = users.getUserList('Code Node');

        expect(userList).toEqual(['Juan', 'Miguel']);
    });

    it('should return names for Java Code rooms', () => {
        var userList = users.getUserList('Java Code');

        expect(userList).toEqual(['Luis']);
    });

    it('should look for a user id', () => {
        var userId = '2';
        var user = users.getUser(userId);
        expect(user.id).toBe(userId);
    });

    it('should not find a user id', () => {
        var userId = '4';
        var user = users.getUser(userId);
        expect(user).toNotExist();
    });

    it('should remove a user', () => {
        var userId = '2';
        var user = users.removeUser(userId);
        expect(user.id).toBe(userId);
    });

    it('should not remove a user', () => {
        var userId = '4';
        var user = users.removeUser(userId);
        expect(user).toNotExist();
    });

});