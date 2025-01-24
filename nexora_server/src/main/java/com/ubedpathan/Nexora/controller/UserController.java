package com.ubedpathan.Nexora.controller;

import com.ubedpathan.Nexora.services.UserServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserServices userServices;

    @PostMapping("/addProfile")
    public ResponseEntity<?> hendleUserProfileAdd(@RequestParam("file") MultipartFile file){
        if(!file.isEmpty()){
            boolean isProfileAdded = userServices.hendleUserProfileAdd(file);
            if(isProfileAdded){
                return ResponseEntity.ok().body("Profile Image Added");
            }

        }
        return ResponseEntity.badRequest().body("Fail to add image");
    }
}
