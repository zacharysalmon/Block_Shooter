<!DOCTYPE html>
<html>

<head>
    <title>Leaderboard</title>
    <link href="css_project.css" type="text/css" rel="stylesheet" />
</head>

<body>
      <a href="http://ice.truman.edu/~zrs8473/semester_project/milestones/game.html">Back to Game</a>
<?php

    $db = connect_to_db();
    $create_table = "CREATE TABLE IF NOT EXISTS leaderboard (lb_name VARCHAR(256) NOT NULL , score FLOAT NOT NULL);";
    $db->exec($create_table);
    if (!empty($_POST)){
        updateLeaderboard();
    }
    $rows = $db->query("SELECT * FROM leaderboard ORDER BY score ASC;");

    ?>
    <div id="lb_header">
        <h1>Leaderboard</h1>
        <table>   
            <tr>
                <th>
                    Place
                </th>       
                <th>
                    Name
                </th>
                <th>
                    Time    
                </th>
            </tr>
        </table>
    </div>

    <?php
    $count = 0;
    foreach($rows as $row)
    {
        $count += 1;
        ?> 
        <div id="lb_output">
            <table>
                <tr>
                    <td>
                        <?= $count; ?>
                    </td>
                    <td>
                        <?= $row["lb_name"] ?>
                    </td>
                    <td>
                        <?= $row["score"]  ?> 
                    </td>
            </table>
        </div>
        <?php
    }


    function test_input($data) 
    {
        $data = trim($data);
        $data = htmlspecialchars($data);
        return $data;
    }
    
    function connect_to_db()
    {
        $dbserver= "mysql.truman.edu";
        $dbname= "zrs8473CS315";
        $dbuser= "zrs8473";
        $dbpass= "";
        try 
        {
        $db = new PDO("mysql:host=$dbserver;dbname=$dbname","$dbuser", "$dbpass");
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        return $db;
        }
        catch (PDOException $e) 
        {
        echo $e->getMessage() . "<br>";
        }
    }

    function updateLeaderboard() {

        $lb_name = "";
        $final_score = $_POST['finalScore'];
        $input_error = false;

        if (empty($_POST["lb_name"])) 
        {
            // echo "* Name is required *";
            $input_error = true;
        } 
        else
        {
            $lb_name= test_input($_POST["lb_name"]);

            if (!preg_match("/^[a-zA-Z \.:-_()]*$/", $lb_name))
            {
                echo "Name is invalid. Letters only. <br>";
                $input_error = true;
            }
        }

        echo "<br>";
        $db = connect_to_db();
        $find_name = $db->query("SELECT * FROM leaderboard WHERE lb_name = '$lb_name'");
        if (!$input_error){
            if ($find_name->rowCount() > 0)
            {
                foreach ($find_name as $asdf)
                {
                    if($asdf['score'] > $final_score){
                        $sql = "UPDATE leaderboard SET score='$final_score' WHERE lb_name = '$lb_name'";
                        $send_data = $db->prepare($sql);
                        $send_data->bindParam(':lb_name', $lb_name);
                        $send_data->bindParam(':score', $final_score);
                        $send_data->execute();
                        echo "Great job " . $lb_name . ". You made a new personal best with your score of " . $final_score . "<br>";
                    }
                    else{
                        echo "Nice try, " . $lb_name . ". You didn't beat your last score of " . $asdf['score'] . ". Try again! <br>";
                    }
                }
            }
            else
            {     
                $sql = "INSERT INTO leaderboard (lb_name, score) VALUES (:lb_name, :score);";
                $send_data = $db->prepare($sql);
                $send_data->bindParam(':lb_name', $lb_name);
                $send_data->bindParam(':score', $final_score);
                $send_data->execute();
        
                echo $lb_name . " was added to the leaderboard , with a score of " . $final_score . ". Thanks for playing! <br>";
            }
        }
        

    }
?>
</body>

</html>