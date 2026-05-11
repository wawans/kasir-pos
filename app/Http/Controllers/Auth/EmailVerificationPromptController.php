<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmailVerificationPromptController extends Controller
{
    /**
     * Show the email verification prompt page.
     */
    public function __invoke(Request $request): JsonResponse
    {
        return response()->json([
            'status' => $request->user()->hasVerifiedEmail() ? '' : $request->session()->get('status'),
        ]);

    }
}
