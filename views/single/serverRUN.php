<?php

    echo ++$argv[1];
//$argv[0]='/Users/jeffborland/web/gameOn/single/serverRUN.php';
     $_ = $_SERVER['_'];

     register_shutdown_function(function () {
      global $_, $argv; // note we need to reference globals inside a function
      // restart myself
      pcntl_exec($_, $argv);
  });

  echo "\n======== start =========\n";
  // do a lot of stuff
    $argv1[0] = '/Users/jeffborland/web/gameOn/single/serverTEST.php';
    pcntl_exec($_, $argv1);
  $cnt = 0;
  while( $cnt++ < 10000000 ){}
  echo "\n========== end =========\n";

  die; // exited properly
  // we can't reach here
  pcntl_exec($_, $argv);
?>
