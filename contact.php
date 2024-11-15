<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact - Prodigy Photography</title>
    <link rel="stylesheet" href="styles.css">
    <style>
        /* Your existing styles here */
    </style>
</head>
<body>
    <header>
        <h1>Prodigy Photography</h1>
        <div class="header-buttons">
            <a href="index.html" class="header-button">Home</a>
            <a href="gallery.html" class="header-button">Gallery</a>
            <a href="contact.php" class="header-button">Contact</a>
        </div>
        <button id="cart-button">Cart (<span id="cart-count">0</span>)</button>
    </header>

    <section class="about-container">
        <h2>Contact Us</h2>
        <p>Feel free to get in touch with me for any questions, custom orders, or collaborations.</p>
    </section>

    <?php
    if(isset($_POST['submit'])) {
        $name = $_POST['name'];
        $email = $_POST['email'];
        $message = $_POST['message'];
        
        $to = "prodigyphotography98@gmail.com";
        $subject = "New Contact Form Submission";
        
        $email_content = "Name: $name\n";
        $email_content .= "Email: $email\n\n";
        $email_content .= "Message:\n$message\n";
        
        $headers = "From: $email\r\n";
        $headers .= "Reply-To: $email\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();
        
        if(mail($to, $subject, $email_content, $headers)) {
            echo "<div class='alert success'>Thank you for your message! We'll get back to you soon.</div>";
        } else {
            echo "<div class='alert error'>Sorry, there was an error sending your message. Please try again.</div>";
        }
    }
    ?>

    <div class="container">
        <form method="POST" action="<?php echo $_SERVER['PHP_SELF']; ?>" class="contact-form">
            <input type="text" name="name" placeholder="Your Name" required>
            <input type="email" name="email" placeholder="Your Email" required>
            <textarea name="message" placeholder="Your Message" rows="5" required></textarea>
            <button type="submit" name="submit" class="btn">Send Message</button>
        </form>
    </div>

    <footer>
        <p>&copy; 2024 Prodigy Photography. All rights reserved.</p>
        <p><a href="terms.html">Terms and Conditions</a> | <a href="privacy.html">Privacy Policy</a></p>
    </footer>

    <style>
        .alert {
            padding: 15px;
            margin: 20px auto;
            max-width: 600px;
            border-radius: 4px;
            text-align: center;
        }
        .success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
    </style>
</body>
</html> 