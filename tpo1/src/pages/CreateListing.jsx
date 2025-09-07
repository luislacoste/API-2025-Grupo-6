import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './CreateListing.css';

const CreateListing = () => {
  const { createProductListing, categories } = useProducts();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    newCategory: '',
    description: '',
    stock: '1'
  });

  // Estado para manejo de imágenes
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showNewCategory, setShowNewCategory] = useState(false);

  // Manejar cambios en inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Manejar selección de categoría
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === 'nueva') {
      setShowNewCategory(true);
      setFormData(prev => ({ ...prev, category: '', newCategory: '' }));
    } else {
      setShowNewCategory(false);
      setFormData(prev => ({ ...prev, category: value, newCategory: '' }));
    }
  };

  // Manejar carga de imágenes
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    // Validar número máximo de imágenes
    if (images.length + files.length > 5) {
      setErrors(prev => ({
        ...prev,
        images: 'Máximo 5 imágenes permitidas'
      }));
      return;
    }

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      setErrors(prev => ({
        ...prev,
        images: 'Solo se permiten archivos de imagen (JPG, PNG, WEBP)'
      }));
      return;
    }

    // Validar tamaño de archivo (máximo 5MB por imagen)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setErrors(prev => ({
        ...prev,
        images: 'Cada imagen debe ser menor a 5MB'
      }));
      return;
    }

    // Procesar archivos válidos
    const newImages = [...images, ...files];
    setImages(newImages);

    // Crear previsualizaciones
    const newPreviews = [...imagePreviews];
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push({
          file: file,
          url: e.target.result,
          name: file.name
        });
        setImagePreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    });

    // Limpiar error de imágenes
    if (errors.images) {
      setErrors(prev => ({
        ...prev,
        images: ''
      }));
    }
  };

  // Remover imagen
  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del producto es obligatorio';
    }

    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'El precio debe ser un número mayor a 0';
    }

    const selectedCategory = showNewCategory ? formData.newCategory : formData.category;
    if (!selectedCategory.trim()) {
      newErrors.category = 'Debes seleccionar o crear una categoría';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'La descripción debe tener al menos 20 caracteres';
    }

    if (!formData.stock || isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      newErrors.stock = 'El stock debe ser un número mayor o igual a 0';
    }

    if (images.length === 0) {
      newErrors.images = 'Debes agregar al menos una imagen';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Convertir imágenes a URLs (simulación - en producción serían subidas a un servidor)
  const processImages = () => {
    // En un entorno real, aquí subirías las imágenes a un servidor
    // Por ahora, usamos las URLs de vista previa
    return imagePreviews.map(preview => preview.url);
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Procesar imágenes
      const imageUrls = processImages();

      // Preparar datos del producto
      const productData = {
        name: formData.name,
        price: formData.price,
        category: showNewCategory ? formData.newCategory : formData.category,
        description: formData.description,
        stock: formData.stock,
        images: imageUrls,
        userId: user?.id || 'anonymous'
      };

      // Crear publicación
      const result = createProductListing(productData);

      if (result.success) {
        // Mostrar mensaje de éxito y redirigir
        alert('¡Producto publicado exitosamente!');
        navigate('/'); // Redirigir al inicio
      } else {
        setErrors({ submit: result.error });
      }
    } catch (error) {
      setErrors({ submit: 'Error al crear la publicación. Inténtalo nuevamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-listing-container">
      <div className="create-listing-header">
        <h1>Crear Nueva Publicación</h1>
        <p>Vende tu producto completando los siguientes datos</p>
      </div>

      <form onSubmit={handleSubmit} className="create-listing-form">
        {/* Información básica */}
        <div className="form-section">
          <h2>Información del Producto</h2>
          
          <div className="form-group">
            <label htmlFor="name">Nombre del Producto *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Ej: iPhone 15 Pro Max 256GB"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="price">Precio (ARS) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="0.00"
              min="0"
              step="0.01"
              className={errors.price ? 'error' : ''}
            />
            {errors.price && <span className="error-message">{errors.price}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="stock">Stock Disponible *</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              min="0"
              className={errors.stock ? 'error' : ''}
            />
            {errors.stock && <span className="error-message">{errors.stock}</span>}
          </div>
        </div>

        {/* Categoría */}
        <div className="form-section">
          <h2>Categoría</h2>
          
          <div className="form-group">
            <label htmlFor="category">Categoría del Producto *</label>
            <select
              id="category"
              onChange={handleCategoryChange}
              value={showNewCategory ? 'nueva' : formData.category}
              className={errors.category ? 'error' : ''}
            >
              <option value="">Selecciona una categoría</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
              <option value="nueva">+ Crear nueva categoría</option>
            </select>
            {errors.category && <span className="error-message">{errors.category}</span>}
          </div>

          {showNewCategory && (
            <div className="form-group">
              <label htmlFor="newCategory">Nueva Categoría</label>
              <input
                type="text"
                id="newCategory"
                name="newCategory"
                value={formData.newCategory}
                onChange={handleInputChange}
                placeholder="Nombre de la nueva categoría"
                className={errors.category ? 'error' : ''}
              />
            </div>
          )}
        </div>

        {/* Descripción */}
        <div className="form-section">
          <h2>Descripción</h2>
          
          <div className="form-group">
            <label htmlFor="description">Descripción del Producto *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe tu producto en detalle, incluye características, estado, etc."
              rows="5"
              className={errors.description ? 'error' : ''}
            />
            <div className="char-count">
              {formData.description.length} caracteres (mínimo 20)
            </div>
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>
        </div>

        {/* Imágenes */}
        <div className="form-section">
          <h2>Fotos del Producto</h2>
          
          <div className="form-group">
            <label htmlFor="images">Imágenes *</label>
            <div className="image-upload-area">
              <input
                type="file"
                id="images"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="images" className="upload-button">
                <span>📷</span>
                Agregar Fotos
              </label>
              <p className="upload-help">
                Sube hasta 5 imágenes (JPG, PNG, WEBP - máx. 5MB cada una)
              </p>
            </div>
            {errors.images && <span className="error-message">{errors.images}</span>}
            
            {/* Previsualización de imágenes */}
            {imagePreviews.length > 0 && (
              <div className="image-previews">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="image-preview">
                    <img src={preview.url} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="remove-image"
                    >
                      ✕
                    </button>
                    {index === 0 && (
                      <span className="main-image-badge">Principal</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Error general */}
        {errors.submit && (
          <div className="error-message submit-error">
            {errors.submit}
          </div>
        )}

        {/* Botones */}
        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="cancel-button"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? 'Publicando...' : 'Publicar Producto'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateListing;
