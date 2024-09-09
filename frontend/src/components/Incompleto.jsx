import Navbar from './Navbar';
import placeholderImage from '../assets/images/Incompleto.png'; // Importa tu imagen aquí

export const Incompleto = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Navbar />
      <div style={{ marginLeft: '20px', marginRight: '20px' }}>
        <img
          src={placeholderImage}
          alt="Placeholder"
          style={{
            maxWidth: '100%',
            marginTop: '20px',
            borderRadius: '5px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)'
          }}
        />
      </div>
    </div>
  );
};
