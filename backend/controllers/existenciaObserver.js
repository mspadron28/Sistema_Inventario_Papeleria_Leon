import db from '../db.js';
import subjectInstance from './observer.js';

class ExistenciaObserver {
    async update({ id_existencia, cantidad, operation }) {
        const sign = operation === 'entrada' ? '+' : '-';
        try {
            const queryText = `UPDATE existencia SET stockactual_existencia = stockactual_existencia ${sign} $1 WHERE id_existencia = $2 RETURNING *`;
            const result = await db.query(queryText, [cantidad, id_existencia]);
        } catch (error) {
            console.error('Error updating stock:', error);
        }
    }
}


const existenciaObserverInstance = new ExistenciaObserver();
subjectInstance.addObserver(existenciaObserverInstance);

export default existenciaObserverInstance;
