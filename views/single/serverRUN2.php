<?php
    echo ++$argv[1];
    $_ = $_SERVER['_'];
    $restartMyself = function () {
        global $_, $argv;
        pcntl_exec($_, $argv);
    };
    register_shutdown_function($restartMyself);
    pcntl_signal(SIGTERM, $restartMyself);
    pcntl_signal(SIGHUP,  $restartMyself);
    pcntl_signal(SIGINT,  $restartMyself);
    set_error_handler($restartMyself , E_ALL); // Catch all errors

    echo "\n======== start =========\n";
    require("serverTEST.php");
    $cnt = 0;
    while( $cnt++ < 10000000 ){}

    echo $CAREFUL_NOW; // NOTICE: will also be caught

    // we would normally still go here
    echo "\n===== what if? =========\n";
    require 'OOPS! I dont exist.'; // FATAL Error:

    // we can't reach here
    echo "\n========== end =========\n";
    die; // exited properly
    // we can't reach here
    pcntl_exec($_, $argv);


    ?>
