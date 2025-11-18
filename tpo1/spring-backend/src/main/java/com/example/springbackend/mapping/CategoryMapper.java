package com.example.springbackend.mapping;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;
import com.example.springbackend.dto.CategoryDTO;
import com.example.springbackend.model.Category;

@Component
public class CategoryMapper {

    public Category toEntity(CategoryDTO dto) {
        if (dto == null) return null;
        Category c = new Category();
        c.setId(dto.getId());
        c.setName(dto.getName());
        c.setDescription(dto.getDescription());
        c.setIcon(dto.getIcon());
        c.setProductCount(dto.getProductCount());
        return c;
    }

    public CategoryDTO toDto(Category entity) {
        if (entity == null) return null;
        return new CategoryDTO(entity.getId(), entity.getName(), entity.getDescription(), entity.getIcon(),
                entity.getProductCount());
    }

    public List<CategoryDTO> toDtoList(List<Category> entities) {
        if (entities == null) return null;
        return entities.stream().map(this::toDto).collect(Collectors.toList());
    }
}
