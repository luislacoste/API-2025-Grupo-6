package com.example.springbackend.mapping;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;
import com.example.springbackend.dto.ProductDTO;
import com.example.springbackend.model.Product;

@Component
public class ProductMapper {

  public Product toEntity(ProductDTO dto) {
    if (dto == null) return null;
    Product p = new Product();
    p.setId(dto.getId());
    p.setName(dto.getName());
    p.setPrice(dto.getPrice());
    p.setCategory(dto.getCategory());
    p.setDescription(dto.getDescription());
    p.setImage(dto.getImage());
    p.setStock(dto.getStock());
    p.setCreatedAt(dto.getCreatedAt());
    p.setUserId(dto.getUserId());
    return p;
  }

  public ProductDTO toDto(Product entity) {
    if (entity == null) return null;
    return new ProductDTO(entity.getId(), entity.getName(), entity.getPrice(), entity.getCategory(),
        entity.getDescription(), entity.getImage(), entity.getStock(), entity.getCreatedAt(),
        entity.getUserId());
  }

  public List<ProductDTO> toDtoList(List<Product> entities) {
    if (entities == null) return null;
    return entities.stream().map(this::toDto).collect(Collectors.toList());
  }

}
