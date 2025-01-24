package com.ubedpathan.Nexora.publicApi;

import com.ubedpathan.Nexora.dtos.SignUpDto;
import com.ubedpathan.Nexora.models.UserEntity;
import com.ubedpathan.Nexora.repositories.UserRepository;
import com.ubedpathan.Nexora.services.UserServices;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/public")
public class SignUp {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserServices userServices;

    @PostMapping("/signup")
    public ResponseEntity<?> handleSignIn(@Valid @RequestBody SignUpDto request){
        boolean isUserSignUp = userServices.handleUserSignUp(request);
        if(isUserSignUp) return new ResponseEntity<>("User SignUp successfully", HttpStatus.OK);
        else return new ResponseEntity<>("Fail to SignUp", HttpStatus.BAD_REQUEST);
    }
}
