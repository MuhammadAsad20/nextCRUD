"use client";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Trash2, ShieldCheck, Mail, Search, Loader2, AlertCircle } from "lucide-react";
import { deleteUser, updateRole } from "@/app/dashboard/users/action";

export default function UserTableClient({ initialUsers }) {
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  const filteredUsers = initialUsers.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    setLoadingId(userId);
    try {
      await updateRole(userId, newRole);
    } catch (err) {
      console.error(err);
    }
    setLoadingId(null);
  };

  const handleDelete = async (userId) => {
    setLoadingId(userId);
    try {
      await deleteUser(userId);
    } catch (err) {
      console.error(err);
    }
    setLoadingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative max-w-sm group">
        <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors z-10" />
        <Input 
          placeholder="Search members..." 
          className="pl-10 bg-slate-900/50 border-slate-800 rounded-xl text-white h-11"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-slate-900/40 border border-slate-800/50 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-slate-950/50">
            <TableRow className="border-slate-800">
              <TableHead className="py-6 px-6 text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">Identity</TableHead>
              <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] text-center">Role Control</TableHead>
              <TableHead className="text-right px-6 text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((u) => (
              <TableRow key={u._id} className="border-slate-800/50 hover:bg-indigo-500/5 transition-colors group">
                <TableCell className="py-5 px-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-indigo-500 uppercase">
                      {u.name?.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-200">{u.name}</span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1.5"><Mail className="w-3 h-3" /> {u.email}</span>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell className="text-center">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button disabled={loadingId === u._id} className="active:scale-95 transition-transform disabled:opacity-50">
                        <Badge className={`rounded-lg px-3 py-1 text-[10px] font-black cursor-pointer ${
                          u.role === 'admin' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {u.role === 'admin' && <ShieldCheck className="w-3 h-3 mr-1 inline" />}
                          {u.role?.toUpperCase() || 'USER'}
                        </Badge>
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-slate-900 border-slate-800 text-white rounded-[2rem]">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Change Role?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                          Are you sure you want to change <b>{u.name}'s</b> role to {u.role === "admin" ? "USER" : "ADMIN"}?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleRoleChange(u._id, u.role)} className="bg-indigo-600 hover:bg-indigo-700">Confirm Change</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>

                <TableCell className="text-right px-6">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button disabled={loadingId === u._id} className="p-2.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all">
                        {loadingId === u._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-slate-950 border-red-900/50 text-white rounded-[2rem]">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-red-500">
                          <AlertCircle className="w-5 h-5" /> Delete User
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                          This action is permanent. This will delete the account for <b>{u.name}</b> and remove their data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-slate-900 border-slate-800 text-white hover:bg-slate-800">Keep User</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(u._id)} className="bg-red-600 hover:bg-red-700">Delete Permanently</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
