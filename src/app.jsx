import React, { useState, useEffect } from 'react';
import supabase from './supabaseClient';
import ScannerZxing from './ScannerZxing';
import './App.css';

const App = () => {
  const [barcode, setBarcode] = useState(null);
  const [productInfo, setProductInfo] = useState(null);
  const [formData, setFormData] = useState({
    brand: '',
    description: '',
    category: '',
  });
  const [products, setProducts] = useState([]);
  const [isScanning, setIsScanning] = useState(true); // Gère l'état du scanner

  // Charger les produits depuis Supabase au démarrage
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) {
        console.error('Erreur lors du chargement des produits :', error);
      } else if (data && Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error('Les données retournées ne sont pas valides :', data);
      }
    };

    fetchProducts();
  }, []);

  const handleDetected = (code) => {
    setBarcode(code);
    setIsScanning(false); // Désactive le scanner

    // Vérifie si le code-barres existe dans la base de données locale
    const product = products.find((p) => p.barcode === code);
    if (product) {
      setProductInfo(product);
    } else {
      setProductInfo(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = async () => {
    if (barcode && formData.brand && formData.description && formData.category) {
      const { data, error } = await supabase
        .from('products')
        .insert(
          [
            {
              barcode: barcode,
              brand: formData.brand,
              description: formData.description,
              category: formData.category,
            },
          ],
          { returning: 'representation' }
        );

      if (error) {
        console.error('Erreur lors de l\'ajout du produit :', error);
        alert(`Erreur : ${error.message}`);
      } else {
        if (data && Array.isArray(data)) {
          setProducts((prev) => [...prev, ...data]);
        } else {
          console.error('Les données retournées ne sont pas valides :', data);
        }
        setProductInfo(data ? data[0] : null);
        setFormData({ brand: '', description: '', category: '' });
        alert('Produit ajouté avec succès !');
      }
    } else {
      alert("Veuillez remplir tous les champs.");
    }
  };

  const handleRestartScan = () => {
    setBarcode(null);
    setProductInfo(null);
    setIsScanning(true); // Relance le scanner
  };

  return (
    <div className="app">
      <h1>TRIONS Pour La Planète</h1>
      <p>Scannez un produit pour savoir où le jeter.</p>

      {isScanning ? (
        <div className="scanner-container">
          <ScannerZxing onDetected={handleDetected} />
        </div>
      ) : (
        <div className="result">
          {barcode && (
            <>
              <h2>Code-barres détecté :</h2>
              <p className="barcode">{barcode}</p>
            </>
          )}
          {productInfo ? (
            <div>
              <h3>Informations du produit :</h3>
              <p><strong>Marque :</strong> {productInfo.brand}</p>
              <p><strong>Description :</strong> {productInfo.description}</p>
              <p><strong>Catégorie :</strong> {productInfo.category}</p>
            </div>
          ) : (
            <div>
              <h3>Ajouter les informations pour ce produit :</h3>
              <input
                type="text"
                name="brand"
                placeholder="Marque"
                value={formData.brand}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="">Choisir une catégorie</option>
                <option value="Plastique (Poubelle Jaune)">Plastique (Poubelle Jaune)</option>
                <option value="Verre (Poubelle Verte)">Verre (Poubelle Verte)</option>
                <option value="Déchets organiques (Poubelle Bleue)">Déchets organiques (Poubelle Bleue)</option>
                <option value="Autre">Autre</option>
              </select>
              <button onClick={handleAddProduct}>Ajouter</button>
            </div>
          )}
          <button onClick={handleRestartScan} className="restart-btn">
            Relancer le scanner
          </button>
        </div>
      )}
    </div>
  );
};

export default App;