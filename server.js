const mongoose = require('mongoose');   // deklaracja zmiennej
const Schema = mongoose.Schema;   // kolekcja w bazie danych 
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/nodeappdatabase', {
    useMongoClient: true
}); // polaczenie z baza danych 


// schemat dla app, tworzenie uzytkownikow 
// klucz => wartosc 
const userSchema = new Schema({
    name: String,
    username: { type: String, required: true, unique: true },  // musi byc unikalny i obowiazkowe podanie tych danych, oraz w typie abc...
    password: { type: String, required: true },
    admin: Boolean, // true or fals! 
    created_at: Date,
    updated_at: Date
});

// ze stworzonym modelem tworzymy metody : 
// funkcja na modyfikacje imienia uzytkownika podczas logowania : 
userSchema.methods.manify = function(next) {
    this.name = this.name + '-boy';

    return next(null, this.name);
};

// funkcja na ustawianie w polu aktualnych dat, ktora wykonuje sie przed zalogowaniem uzytkownika 
// w bazie danych zostana zapisane rekordy tworzenia i aktualizacje logowania 
userSchema.pre('save', function(next) {
    //pobranie aktualnego czasu
    const currentDate = new Date();

    //zmiana pola na aktualny czas
    this.updated_at = currentDate;

    if (!this.created_at) {
        this.created_at = currentDate;
    }

    // next() jest funkcją która przechodzi do następnego hooka do
    // wykonania przed lub po requeście
    next();
});

// tworzenie modelu : 
const User = mongoose.model('User', userSchema); // + mixed -typ wartosci moze sie zmienic, i objectId - typ danych do przechowywania zmiennych jako id

// Dodanie nowych metod, tworzenie instancji odpowiednio do modelu z podana wyzej metoda 

// tworzenie instancji modelu User :
const kenny = new User({
    name: 'Kenny',
    username: 'Kenny_the_boy',
    password: 'password'
});
// do tego moentu jest taki nasz szablon


kenny.manify(function(err, name) {
    if (err) throw err;
    console.log('Twoje nowe imię to: ' + name);
});

kenny.save(function(err) {
    if (err) throw err;

    console.log('Uzytkownik ' + kenny.name +  ' zapisany pomyslnie');
});



const benny = new User({
    name: 'Benny',
    username: 'Benny_the_boy',
    password: 'password'
});

// wywolanie jej : 
benny.manify(function(err, name) {
    if (err) throw err;
    console.log('Twoje nowe imię to: ' + name);
});

//wywolanie metody save zeby zapisac w bazie danych 
benny.save(function(err) {
    if (err) throw err;

    console.log('Uzytkownik ' + benny.name +  ' zapisany pomyslnie');
});

const mark = new User({
    name: 'Mark',
    username: 'Mark_the_boy',
    password: 'password'
});

mark.manify(function(err, name) {
    if (err) throw err;
    console.log('Twoje nowe imię to: ' + name);
});

mark.save(function(err) {
    if (err) throw err;

    console.log('Uzytkownik ' + mark.name +  ' zapisany pomyslnie');
});


// odnalezienie uzytkownikow przez metode find , z pustym obiektem // ES6

const findAllUsers = function() {
    // find all users
    return User.find({}, function(err, res) {
        if (err) throw err;
        console.log('Actual database records are ' + res);
    });
}

const findSpecificRecord = function() {
    // find specific record
    return User.find({ username: 'Kenny_the_boy' }, function(err, res) {
        if (err) throw err;
        console.log('Record you are looking for is ' + res);
    })
}

const updadeUserPassword = function() {
    // update user password
    return User.findOne({ username: 'Kenny_the_boy' })
        .then(function(user) {
            console.log('Old password is ' + user.password);
            console.log('Name ' + user.name);
            user.password = 'newPassword';
            console.log('New password is ' + user.password);
            return user.save(function(err) {
                if (err) throw err;

                console.log('Uzytkownik ' + user.name + ' zostal pomyslnie zaktualizowany');
            })
        })
}

const updateUsername = function() {
    // update username
    return User.findOneAndUpdate({ username: 'Benny_the_boy' }, { username: 'Benny_the_man' }, { new: true }, function(err, user) {
        if (err) throw err;

        console.log('Nazwa uzytkownika po aktualizacji to ' + user.username);
    })
}

const findMarkAndDelete = function() {
    // find specific user and delete
    return User.findOne({ username: 'Mark_the_boy' })
        .then(function(user) {
            return user.remove(function() {
                console.log('User successfully deleted');
            });
        })
}

const findKennyAndDelete = function() {
    // find specific user and delete
    return User.findOne({ username: 'Kenny_the_boy' })
        .then(function(user) {
            return user.remove(function() {
                console.log('User successfully deleted');
            });
        });
}

const findBennyAndRemove = function() {
    // find specific user and delete
    return User.findOneAndRemove({ username: 'Benny_the_man' })
        .then(function(user) {
            return user.remove(function() {
                console.log('User successfully deleted');
            });
        });
}

Promise.all([kenny.save(), mark.save(), benny.save()])
    .then(findAllUsers)
    .then(findSpecificRecord)
    .then(updadeUserPassword)
    .then(updateUsername)
    .then(findMarkAndDelete)
    .then(findKennyAndDelete)
    .then(findBennyAndRemove)
    .catch(console.log.bind(console))