package com.example.springbackend.mapping;

import java.util.List;
import com.example.springbackend.dto.ProductDTO;
import com.example.springbackend.model.Product;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductMapper {
  Product toEntity(ProductDTO dto);

  ProductDTO toDto(Product entity);

  List<ProductDTO> toDtoList(List<Product> entities);

}
