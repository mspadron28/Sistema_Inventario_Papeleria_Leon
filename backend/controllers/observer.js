// Sujeto 
class Subject {
    constructor() {
        this.observers = [];
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    removeObserver(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notify(data) {
        console.log('Notificando observeradores:', data);
        this.observers.forEach(observer => observer.update(data));
    }
}

const subjectInstance = new Subject();
export default subjectInstance;

  