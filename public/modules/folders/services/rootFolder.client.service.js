/**
 * Created by sergio on 26-10-14.
 */
'use strict';

angular.module('folders').factory('RootFolder',['$resource', 'Authentication', 'Folders',
    function($resource, Authentication, Folders) {

        var authentication = Authentication;
        var rootFolder = {};

        var folderRoot = $resource('/folder/user/:userId/folderName/:name', {
            'userId' : authentication.user._id,
            name: 'root'
        });

        var resp = folderRoot.get(function(){
            if (resp.status == 0){
                var folder = new Folders({
                    name: 'root'
                });

                folder.$save(function(resp){
                    console.log("se crea folder root", resp);
                    rootFolder = resp;

                }, function(error){
                    console.error("error al crear root", error);
                })
            }
            if (resp.status == 1){
                console.log("usuario ya cuenta con rootFolder, se asigna!")

                rootFolder = resp.data[0];
            }
        });


        return {
            getRootFolder : function(){
                return rootFolder;
            }
        }


    }
]);