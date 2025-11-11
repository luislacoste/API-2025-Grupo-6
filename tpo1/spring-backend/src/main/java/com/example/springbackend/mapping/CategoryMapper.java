package com.example.springbackend.mapping;

import java.util.List;
import com.example.springbackend.dto.CategoryDTO;
import com.example.springbackend.model.Category;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    Category toEntity(CategoryDTO dto);

    CategoryDTO toDto(Category entity);

    List<CategoryDTO> toDtoList(List<Category> entities);
}
